import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


function Post() {
  let { id } = useParams();
  const [listOfPosts, setListOfPosts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/post/byId/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, [id]); 

  return (
    <div>
      {listOfPosts.map((value, key) => (
        <div key={key}>
          <div>{value.name}</div>
          <div>{value.price}</div>
        </div>
      ))}
    </div>
  );
}

export default Post;
