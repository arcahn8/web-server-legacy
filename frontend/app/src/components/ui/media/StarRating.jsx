import React, { useEffect, useState } from "react";
import { TbStarFilled, TbStar } from "react-icons/tb";

const StarRating = (props) => {
  const [rating, setRating] = useState(props.value);
  const stars = [];

  useEffect(() => {
    setRating(props.value);
  }, [props.value]);

  for (let i = 0; i < 5; i++) {
    if (rating >= i + 1) {
      stars.push(
        <TbStarFilled key={`TbStarFilled${i}`} className="text-amber-400" />
      );
    } else {
      stars.push(<TbStar key={`TbStar${i}`} className="text-gray-400" />);
    }
  }
  if (props.action === "view") {
    return (
      <div className="flex">
        {stars.map((star, i) => (
          <div key={`star${i}`}>{star}</div>
        ))}
      </div>
    );
  }

  if (props.action === "edit") {
    const handleStar = (newRating) => {
      if (props.action === "edit") {
        setRating(newRating);
        props.onChange(newRating);
      }
    };
    return (
      <div className="flex">
        {stars.map((star, i) => (
          <div key={`star${i}`} onClick={() => handleStar(i + 1)}>
            {star}
          </div>
        ))}
      </div>
    );
  }
};

export default StarRating;
