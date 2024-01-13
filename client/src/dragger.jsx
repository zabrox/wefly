import React from "react";
import './dragger.css';

export const Dragger = ({ state, setState }) => {
    const handleMouseDown = React.useCallback((e) => {
        document.body.classList.add('noselect');

        const startX = e.clientX;
        const startWidth = state.controlPanelSize;

        const doDrag = (e) => {
            setState({...state, controlPanelSize: startWidth + e.clientX - startX});
        }

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
        }

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    }, [state.controlPanelSize]);

    return (
        <div id='dragger' onMouseDown={handleMouseDown} />
    );
}
