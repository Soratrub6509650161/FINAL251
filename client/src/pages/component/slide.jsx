import React, { useState } from "react";
import image1 from "../../img/slide/1.jpg";
import image2 from "../../img/slide/2.jpg";
import image3 from "../../img/slide/3.jpg";
import image4 from "../../img/slide/4.jpg";
import image5 from "../../img/slide/5.jpg";
import image6 from "../../img/slide/6.jpg";
import image7 from "../../img/slide/7.jpg";

const photos = [
    { fileName: image1 },
    { fileName: image2 },
    { fileName: image3 },
    { fileName: image4 },
    { fileName: image5 },
    { fileName: image6 },
    { fileName: image7 },
];

function Slide() {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSlideChange = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };

    return (
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" onClick={() => handleSlideChange(activeIndex)}>
            <div className="carousel-inner">
                {photos.map((post, index) => (
                    <div key={index} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
                        <img src={post.fileName} className="d-block w-100 resized-image" alt={`Slide ${index + 1}`} />
                    </div>
                ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export default Slide;
