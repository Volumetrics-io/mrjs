import { getSelectionRects, preloadFont } from 'troika-three-text';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MRButtonEntity } from 'mrjs/core/entities/MRButtonEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { MRTextEntity } from 'mrjs/core/entities/MRTextEntity';
import { MRTextInputEntity } from 'mrjs/core/entities/MRTextInputEntity';
import { MRTextFieldEntity } from 'mrjs/core/entities/MRTextFieldEntity';
import { MRTextAreaEntity } from 'mrjs/core/entities/MRTextAreaEntity';

import { mrjsUtils } from 'mrjs';

/**
 * @class TextSystem
 * @classdesc Handles text creation and font rendering for `mr-text`, `mr-textfield`, and `mr-textarea` with a starting framerate of 1/30.
 * @augments MRSystem
 */
export class TextSystem extends MRSystem {
    /**
     * @class
     * @description TextSystem's default constructor
     */
    constructor() {
        super(false);

        this.preloadedFonts = {};

        this.styles = {};
        const styleSheets = Array.from(document.styleSheets);

        styleSheets.forEach((styleSheet) => {
            const cssRules = Array.from(styleSheet.cssRules);
            // all the font-faces rules
            const rulesFontFace = cssRules.filter((rule) => rule.cssText.startsWith('@font-face'));

            rulesFontFace.forEach((fontFace) => {
                const fontData = this.parseFontFace(fontFace.cssText);

                preloadFont(
                    {
                        font: fontData.src,
                    },
                    () => {
                        this.preloadedFonts[fontFace.style.getPropertyValue('font-family')] = fontData.src;
                        document.dispatchEvent(new CustomEvent('font-loaded'));
                    }
                );
            });
        });

        this.app.addEventListener('trigger-text-style-update', (e) => {
            // The event has the entity stored as its detail.
            if (e.detail !== undefined) {
                // console.log('trigger-text-style-update for ', e.detail)
                this._updateSpecificEntity(e.detail);
            }
        });
    }

    /**
     * @function
     * @description When a new entity is created, adds it to the physics registry and initializes the physics aspects of the entity.
     * @param {MREntity} entity - the entity being set up
     */
    onNewEntity(entity) {
        entity instanceof MRTextEntity ? this.registry.add(entity) : null;
    }

    /**
     * @function
     * @description The per entity triggered update call.  Handles updating all text items including updates for style and cleaning of content for special characters.
     */
    _updateSpecificEntity(entity) {
        this.updateStyle(entity);

        // the sync step ensures troika's text render info and geometry is up to date
        // with any text content changes.
        entity.textObj.sync(() => {
            if (entity instanceof MRButtonEntity) {
                entity.textObj.anchorX = 'center';
            } else {
                entity.textObj.position.setX(-entity.width / 2);
                entity.textObj.position.setY(entity.height / 2);
            }

            if (entity instanceof MRTextFieldEntity || entity instanceof MRTextAreaEntity) {
                if (entity == document.activeElement) {
                    entity.updateCursorPosition();
                } else {
                    entity.blur();
                }
            }
        });
    }

    /**
     * @function
     * @description The per global scene event update call. Handles updating all text items including updates for style and cleaning of content for special characters.
     */
    eventUpdate = () => {
        for (const entity of this.registry) {

            // Add a check in case a user manually 
            let text = entity instanceof MRTextFieldEntity || entity instanceof MRTextAreaEntity
                ? entity.hiddenInput.value
                : // troika honors newlines/white space
                  // we want to mimic h1, p, etc which do not honor these values
                  // so we have to clean these from the text
                  // ref: https://github.com/protectwise/troika/issues/289#issuecomment-1841916850
                  entity.textContent
                      .replace(/(\n)\s+/g, '$1')
                      .replace(/(\r\n|\n|\r)/gm, ' ')
                      .trim();

            let textContentChanged = entity.textObj.text != text;
            // console.log('in text system', entity);
            if (entity instanceof MRTextAreaEntity) {
                console.log('on entity', entity);
                console.log('entity.textObj.text', entity.textObj.text);
                console.log('entity.hiddenInput.value', text);
                console.log('textcontentChanged', textContentChanged);
            }

            // Now that we know text is different or at least definitely needs an update
            // we can go and do the larger calculations and changes.
            if (textContentChanged) {
                entity.textObj.text = text;
                this._updateSpecificEntity(entity);
            }
        }
    }

    /**
     * @function
     * @description The per-frame system update call for all text items including updates for style and cleaning of content for special characters.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        // For this system, since we have the 'per entity' and 'per scene event' update calls,
        // we dont need a main update call here.
    }

    /**
     * @function
     * @description Updates the style for the text's information based on compStyle and inputted css elements.
     * @param {MRTextEntityEntity} entity - the text entity whose style is being updated
     */
    updateStyle = (entity) => {
        const { textObj } = entity;
        if (textObj.text.trim().length != 0) {
            textObj.font = this.preloadedFonts[entity.compStyle.fontFamily];
        } else {
            textObj.font = null;
        }
        textObj.fontSize = this.parseFontSize(entity.compStyle.fontSize, entity);
        textObj.fontWeight = this.parseFontWeight(entity.compStyle.fontWeight);
        textObj.fontStyle = entity.compStyle.fontStyle;

        textObj.anchorY = this.getVerticalAlign(entity.compStyle.verticalAlign, entity);

        textObj.textAlign = this.getTextAlign(entity.compStyle.textAlign);

        textObj.lineHeight = this.getLineHeight(entity.compStyle.lineHeight, entity);

        textObj.material.opacity = entity.compStyle.opacity ?? 1;

        this.setColor(textObj, entity.compStyle.color);

        textObj.whiteSpace = entity.compStyle.whiteSpace ?? textObj.whiteSpace;
        textObj.maxWidth = entity.width * 1.001;

        textObj.position.z = 0.0001;
    };

    /**
     * @function
     * @description Handles when text is added as an entity updating content and style for the internal textObj appropriately.
     * @param {MRTextEntityEntity} entity - the text entity being updated
     */
    addText = (entity) => {
        const text = entity.textContent.trim();
        entity.textObj.text = text.length > 0 ? text : ' ';

        this.updateStyle(entity);
    };

    /**
     * @function
     * @description parses the font weight as 'bold', 'normal', etc based on the given weight value
     * @param {number} weight - the numerical representation of the font-weight
     * @returns {string} - the enum of 'bold', 'normal', etc
     */
    parseFontWeight(weight) {
        if (weight >= 500) {
            return 'bold';
        }
        return 'normal';
    }

    /**
     * @function
     * @description parses the font size based on its `XXpx` value and converts it to a usable result based on the virtual display resolution
     * @param {number} val - the value being adjusted
     * @param {object} el - the css element handler
     * @returns {number} - the font size adjusted for the display as expected
     */
    parseFontSize(val, el) {
        const result = parseFloat(val.split('px')[0]) / mrjsUtils.display.VIRTUAL_DISPLAY_RESOLUTION;
        if (mrjsUtils.xr.isPresenting) {
            return result * mrjsUtils.app.scale;
        }
        return result;
    }

    /**
     * @function
     * @description Gets the vertical align
     * @param {number} verticalAlign - the numerical representation in pixel space of the vertical Align
     * @param {MREntity} entity - the entity whose comp style (css) is relevant
     * @returns {string} - the string representation of the the verticalAlign
     */
    getVerticalAlign(verticalAlign, entity) {
        let result = verticalAlign;

        if (typeof result === 'number') {
            result /= mrjsUtils.css.pxToThree(entity.compStyle.fontSize);
        }

        switch (result) {
            case 'baseline':
            case 'sub':
            case 'super':
                return 0;
            case 'text-top':
                return 'top-ex';
            case 'text-bottom':
                return 'bottom';
            case 'middle':
            default:
                return result;
        }
    }

    /**
     * @function
     * @description Gets the line height
     * @param {number} lineHeight - the numerical representation in pixel space of the line height
     * @param {MREntity} entity - the entity whose comp style (css) is relevant
     * @returns {number} - the numerical representation of the the lineHeight
     */
    getLineHeight(lineHeight, entity) {
        let result = mrjsUtils.css.pxToThree(lineHeight);

        if (typeof result === 'number') {
            result /= mrjsUtils.css.pxToThree(entity.compStyle.fontSize);
        }

        return result;
    }

    /**
     * @function
     * @description Gets the text alignment string
     * @param {string} textAlign - handles values for `start`, `end`, `left`, and `right`; otherwise, defaults to the same input as `textAlign`.
     * @returns {string} - the resolved `textAlign`.
     */
    getTextAlign(textAlign) {
        if (textAlign == 'start') {
            return 'left';
        } else if (textAlign == 'end') {
            return 'right';
        }
        return textAlign;
    }

    /**
     * @function
     * @description Sets the matrial color and opacity based on the css color element
     * @param {object} textObj - the textObj whose color is being updated
     * @param {object} color - the representation of color as `rgba(xxx,xxx,xxx)` or as `#xxx`
     */
    setColor(textObj, color) {
        if (color.includes('rgba')) {
            const rgba = color
                .substring(5, color.length - 1)
                .split(',')
                .map((part) => parseFloat(part.trim()));
            textObj.material.color.setStyle(`rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`);

            textObj.material.opacity = rgba[3];
        } else {
            textObj.material.color.setStyle(color ?? '#000');
        }
    }

    /**
     * @function
     * @description Based on the given font-face value in the passed cssString, tries to either use by default or download the requested font-face
     *              for use by the text object.
     * @param {string} cssString - the css string to be parsed for the font-face css value.
     * @returns {object} - json object respresenting the preloaded font-face
     */
    parseFontFace(cssString) {
        const obj = {};
        const match = cssString.match(/@font-face\s*{\s*([^}]*)\s*}/);

        if (match) {
            const fontFaceAttributes = match[1];
            const attributes = fontFaceAttributes.split(';');

            attributes.forEach((attribute) => {
                const [key, value] = attribute.split(':').map((item) => item.trim());
                if (key === 'src') {
                    const urlMatch = value.match(/url\("([^"]+)"\)/);
                    if (urlMatch) {
                        obj[key] = urlMatch[1];
                    }
                } else {
                    obj[key] = value;
                }
            });
        }

        return obj;
    }
}
