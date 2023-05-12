import { useState, useRef, useEffect} from 'react'
import '/src/assets/styles/welcome.scss'

function Home() {
    const fillText = useRef(null);
    const [titleStateWidth, setTitleStateWidth] = useState(0);
    const [titleStateHeight, setTitleStateHeight] = useState(0);
    useEffect(() => {
        setTitleStateWidth(fillText.current.offsetWidth);
        setTitleStateHeight(fillText.current.offsetHeight)

        const handleResize = () => {
            setTitleStateWidth(fillText.current.offsetWidth);
            setTitleStateHeight(fillText.current.offsetHeight)
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return(
        <div className="home-container">
            <div className="home-container-information">
                <div
                style={{
                    width: `${titleStateWidth}px`,
                    height: `${titleStateHeight+50}px`
                }}
                className="title">
                    <p ref={fillText} className="fill-text-title">
                        Quizzario
                    </p>
                    <p className="stroke-text-title">
                        Quizzario
                    </p>
                </div>
                <p className="description-section">
                    Welcome to our exciting quiz web app! If you are a trivia buff or just love to test your knowledge, you have come to the right place.
                </p>
            </div>
        </div>
    );
}

export default Home