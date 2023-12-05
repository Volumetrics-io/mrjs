import { getSelectionRects, preloadFont } from 'troika-three-text';
import System from '../core/System';
import { TextField } from '../UI/Text/TextField';
import { TextArea } from '../UI/Text/TextArea';

/**
 *
 */
export class TextSystem extends System {
    /**
     *
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

        const entities = this.app.querySelectorAll('mr-text, mr-textfield, mr-textarea');
        for (const entity of entities) {
            this.registry.add(entity);
            this.addText(entity);
            entity.textObj.sync(() => {
                entity.textObj.position.setY(entity.height / 2);
            });
        }
    }

    /**
     *
     * @param deltaTime
     * @param frame
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
                text = entity.textContent.replace(/(\n)\s+/g, '$1').trim();
            }
            if (entity.textObj.text != text) {
                entity.textObj.text = text.length > 0 ? text : ' ';
                entity.textObj.sync();
            }

            this.updateStyle(entity);
            if (entity.needsUpdate) {
                entity.needsUpdate = false;
                entity.textObj.sync(() => {
                    entity.textObj.position.setY(entity.height / 2);
                });
            }
        }
    }

    updateStyle = (entity) => {
        const { textObj } = entity;

        textObj.font = this.preloadedFonts[entity.compStyle.fontFamily] ?? textObj.font;
        textObj.fontSize = this.parseFontSize(entity.compStyle.fontSize, entity);
        textObj.fontWeight = this.parseFontWeight(entity.compStyle.fontWeight);
        textObj.fontStyle = entity.compStyle.fontStyle;

        textObj.anchorX = 'center';
        textObj.anchorY = this.getVerticalAlign(entity.compStyle.verticalAlign, entity);

        textObj.textAlign = this.setTextAlign(entity.compStyle.textAlign);
        textObj.lineHeight = this.getLineHeight(entity.compStyle.lineHeight, entity);

        textObj.material.opacity = entity.compStyle.opacity ?? 1;

        this.setColor(textObj, entity.compStyle.color);

        textObj.whiteSpace = entity.compStyle.whiteSpace ?? textObj.whiteSpace;
        textObj.maxWidth = entity.width;

        textObj.position.z = 0.0001;
    };

    addText = (entity) => {
        const text = entity.textContent.trim();
        entity.textObj.text = text.length > 0 ? text : ' ';

        this.updateStyle(entity);
    };

    /**
     *
     * @param weight
     */
    parseFontWeight(weight) {
        if (weight >= 500) {
            return 'bold';
        }

        return 'normal';
    }

    /**
     *
     * @param verticalAlign
     * @param entity
     */
    getVerticalAlign(verticalAlign, entity) {
        let result = this.parseFontSize(verticalAlign, entity);

        if (typeof result === 'number') {
            result /= this.parseFontSize(entity.compStyle.fontSize, entity);
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
     *
     * @param lineHeight
     * @param entity
     */
    getLineHeight(lineHeight, entity) {
        let result = this.parseFontSize(lineHeight, entity);

        if (typeof result === 'number') {
            result /= this.parseFontSize(entity.compStyle.fontSize, entity);
        }

        return result;
    }

    /**
     *
     * @param textAlign
     */
    setTextAlign(textAlign) {
        switch (textAlign) {
            case 'start':
            case 'left':
                return 'left';
            case 'end':
            case 'right':
                return 'right';
            default:
                return textAlign;
        }
    }

    /**
     *
     * @param textObj
     * @param color
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
     *
     * @param val
     * @param el
     */
    parseFontSize(val, el) {
        const result = parseFloat(val.split('px')[0]) / MRJS.VIRTUAL_DISPLAY_RESOLUTION;
        if (global.inXR) {
            return result * el.windowHorizontalScale;
        }
        return result;
    }

    /**
     *
     * @param el
     */
    getEM(el) {}

    /**
     *
     * @param el
     */
    getREM(el) {}

    /**
     *
     * @param el
     */
    getVH(el) {
        return el.closest('mr-container').absoluteHeight;
    }

    /**
     *
     * @param el
     */
    getVW(el) {
        return el.closest('mr-container').absoluteWidth;
    }

    /**
     *
     * @param el
     */
    getVMax(el) {
        return Math.max(this.getVH(el), this.getVW(el));
    }

    /**
     *
     * @param el
     */
    getVMin(el) {
        return Math.min(this.getVH(el), this.getVW(el));
    }

    /**
     *
     * @param cssString
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
