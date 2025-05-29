import { useState } from 'react'
import '../assets/Emoji.css'
import myimg from '../assets/test.png'
//이미지와 제목 제작자
function Emoji({ src, alt }) {
  return (
    <li className="emoji-item">
      <img src={src} alt={alt} className="emoji-image" />
    </li>
  );
}

export default Emoji;

