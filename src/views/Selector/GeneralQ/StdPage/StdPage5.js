import React, { useState } from 'react';
import texts from '../../../texts'
import styles from './StdPageNew.module.css'


export default function StdPage5() {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const charWidth = 14;
  const inputWidth = Math.max(160, inputValue.length * charWidth) + "px";

  const inputStyle = {
    // border: `1px solid ${isFocused||hasInput ? 'rgb(32, 206, 232)' : 'rgb(32, 206, 232)'}`,
    // border: ${isFocused||hasInput?}
    width:inputWidth
  };
  return (
    <div className={styles.container}>
      <div className={styles.QContainer}>
        {texts.GeberalQ.StdPage.Page5.P5Q1}
      </div>
      <div className={styles.AcontainerBgImg}>
        {/* <div className={styles.BorderStyle}> */}
        <div className={styles.Acontainer} >
        "I have gained practical experience through internships and research projects, where I further developed my analytical, problem-solving, and teamwork skills. My internships at [
          <input 
            style={{width:'280px'}}
            className={styles.inputKeyWords} 
            placeholder='Previous Internship Company'
            onChange={handleChange}
            />
            ]allowed me to work on real-world projects, enhancing my proficiency in [
              <input 
            style={{width:'220px'}}
            className={styles.inputKeyWords}
            placeholder='mention relevant skills'
            onChange={handleChange}
            />]. Additionally, I am proficient in relevant [
              <input 
            style={{width:'120px'}}
            className={styles.inputKeyWords}
            placeholder='specific field'
            onChange={handleChange}
            />], such as [
              <input 
            style={{width:'200px'}}
            className={styles.inputKeyWords}
            placeholder="skills: like languages"
            onChange={handleChange}
            />] and I have hands-on experience with [
              <input 
            style={{width:'310px'}}
            className={styles.inputKeyWords}
            placeholder="mention relevant software/tools"
            onChange={handleChange}
            />]. These experiences have equipped me with the skills required to the program and contribute to research and academic endeavors."
        {/* </div> */}
        </div>
      </div>
    </div>
  )
}

