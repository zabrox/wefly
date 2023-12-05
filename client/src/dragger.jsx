import React from "react";
import './dragger.css';

export const Dragger = ({ controlPanelSize, setControlPanelSize }) => {
    const handleMouseDown = React.useCallback((e) => {
        document.body.classList.add('noselect');

        const startX = e.clientX;
        const startWidth = controlPanelSize;

        const doDrag = (e) => {
            setControlPanelSize(startWidth + e.clientX - startX);
        }

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
        }

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    }, [controlPanelSize]);

    return (
        <div id='dragger' onMouseDown={handleMouseDown} />
    );
}
