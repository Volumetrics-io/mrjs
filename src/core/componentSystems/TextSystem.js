import { getSelectionRects, preloadFont } from 'troika-three-text';

import { MRSystem } from 'mrjs/core/MRSystem';
import { MRTextEntity } from 'mrjs/core/MRTextEntity';
import { MREntity } from 'mrjs/core/MREntity';
import { TextField } from 'mrjs/core/entities/TextField';
import { TextArea } from 'mrjs/core/entities/TextArea';

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
        super(false, 1 / 30);

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
                        this.preloadedFonts[fontFace.style.fontFamily] = fontData.src;
                    }
                );
            });
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
     * @description The generic system update call for all text items including updates for style and cleaning of content for special characters.
     * @param {number} deltaTime - given timestep to be used for any feature changes
     * @param {object} frame - given frame information to be used for any feature changes
     */
    update(deltaTime, frame) {
        for (const entity of this.registry) {
            let text;
            if (entity instanceof TextField || entity instanceof TextArea) {
                text = entity.input.value;
                if (entity == document.activeElement) {
                    entity.updateCursorPosition();
                } else {
                    entity.blur();
                }
            } else {
                // troika honors newlines/white space
                // we want to mimic h1, p, etc which do not honor these values
                // so we have to clean these from the text
                // ref: https://github.com/protectwise/troika/issues/289#issuecomment-1841916850
                text = entity.textContent
                    .replace(/(\n)\s+/g, '$1')
                    .replace(/(\r\n|\n|\r)/gm, '')
                    .trim();
            }
            if (entity.textObj.text != text) {
                entity.textObj.text = text.length > 0 ? text : ' ';
                entity.textObj.sync();
            }

            this.updateStyle(entity);
            entity.textObj.position.setY(entity.height / 2);
        }
    }

    /**
     * @function
     * @description Updates the style for the text's information based on compStyle and inputted css elements.
     * @param {MRTextEntity} entity - the text entity whose style is being updated
     */
    updateStyle = (entity) => {
        const { textObj } = entity;

        textObj.font = this.preloadedFonts[entity.compStyle.fontFamily] ?? textObj.font;
        textObj.fontSize = this.parseFontSize(entity.compStyle.fontSize, entity);
        textObj.fontWeight = this.parseFontWeight(entity.compStyle.fontWeight);
        textObj.fontStyle = entity.compStyle.fontStyle;

        textObj.anchorX = 'center';
        textObj.anchorY = this.getVerticalAlign(entity.compStyle.verticalAlign, entity);

        textObj.textAlign = this.getTextAlign(entity.compStyle.textAlign);
        textObj.lineHeight = this.getLineHeight(entity.compStyle.lineHeight, entity);

        textObj.material.opacity = entity.compStyle.opacity ?? 1;

        this.setColor(textObj, entity.compStyle.color);

        textObj.whiteSpace = entity.compStyle.whiteSpace ?? textObj.whiteSpace;
        textObj.maxWidth = entity.width;

        textObj.position.z = 0.0001;
    };

    /**
     * @function
     * @description Handles when text is added as an entity updating content and style for the internal textObj appropriately.
     * @param {MRTextEntity} entity - the text entity being updated
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
        const result = parseFloat(val.split('px')[0]) / mrjsUtils.Display.VIRTUAL_DISPLAY_RESOLUTION;
        if (global.inXR) {
            return result * el.windowHorizontalScale;
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
        let result = mrjsUtils.CSS.pxToThree(verticalAlign);

        if (typeof result === 'number') {
            result /= mrjsUtils.CSS.pxToThree(entity.compStyle.fontSize);
        }

        switch (result) {
            case 'baseline':
            case 'sub':
            case 'super':
                return 0;
            case 'text-top':
                return 'top-cap';
            case 'text-bottom':
                return 'bottom';
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
        let result = mrjsUtils.CSS.pxToThree(lineHeight);

        if (typeof result === 'number') {
            result /= mrjsUtils.CSS.pxToThree(entity.compStyle.fontSize);
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
