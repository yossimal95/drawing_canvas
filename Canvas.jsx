import React, {useEffect, useRef, useState} from "react";

function App() {

    const canvasElement = useRef(null);    
    const canvasCtxRef = useRef(null);
    
    const [signatureStart, setSignatureStart] = useState(false);
    const [color, setColor] = useState('#ff0000');

    let isDown = false;

    useEffect(() => {
     canvasCtxRef.current = canvasElement.current.getContext('2d');            
    },[])
    
    const getMousePosition = (event) => {        
        let rect = canvasElement.current.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        }
    }

    const down = (event) => { 
        // for mobile     
        if (event.type.toString() === 'touchstart') {
            let touch = event.touches[0];
            let rect = canvasElement.current.getBoundingClientRect();
            isDown = true;
            canvasCtxRef.current.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
            canvasCtxRef.current.beginPath();
            canvasCtxRef.current.lineWidth = 5;
            canvasCtxRef.current.lineCap = 'round';
            canvasCtxRef.current.strokeStyle = color;
            return;
        }
        // for desktop
        let pos = getMousePosition(event);
        isDown = true;
        canvasCtxRef.current.moveTo(pos.x, pos.y);
        canvasCtxRef.current.beginPath();
        canvasCtxRef.current.lineWidth = 5;
        canvasCtxRef.current.lineCap = 'round';
        canvasCtxRef.current.strokeStyle = color;
    }

    const move = (event) => {  
        if (isDown) {            
            // for mobile     
            if (event.type.toString() === 'touchmove') {
                let touch = event.touches[0];
                let rect = canvasElement.current.getBoundingClientRect();
                canvasCtxRef.current.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
                canvasCtxRef.current.stroke();
                return;
            }
            // for desktop
            let pos = getMousePosition(event);
            canvasCtxRef.current.lineTo(pos.x, pos.y);
            canvasCtxRef.current.stroke();
        }
    }

    const up = () => {
        isDown = false;
        setSignatureStart(true);
    }

    const cleanCanvas = () => {
        canvasCtxRef.current.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height);
        setSignatureStart(false);
    }

    const getPng = () => {
        if (signatureStart) {
            console.log(canvasElement.current.toDataURL());
        }        
    }


  return (
        <div>
            <div width="400" border="1">
                <canvas style={{cursor: 'crosshair', border: '1px solid black', overscrollBehavior: 'contain' }} width="400" height="300" ref={canvasElement} onMouseDown={(event)=>{down(event)}} onTouchStart={(event)=>{down(event)}} onMouseMove={(event)=>{move(event)}} onTouchMove={(event)=>{move(event)}} onMouseUp={(event)=>{up(event)}} onTouchEnd={(event)=>{up(event)}}></canvas>
                <div width="400">
                    <input type="color" value={color} onChange={(event)=>{setColor(event.target.value)}} />
                    <div style={{cursor: 'pointer'}} onClick={()=>{getPng()}}>Save to console</div>
                    <div style={{cursor: 'pointer'}} onClick={()=>{cleanCanvas()}}>Clean</div>
                </div>
            </div>            
        </div>   
  );
}

export default App;
