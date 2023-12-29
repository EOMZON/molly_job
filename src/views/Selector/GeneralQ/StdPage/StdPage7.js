import React, { useRef,useEffect } from 'react';
import texts_EN from '../../../texts'
import texts_CN from '../../../texts_CN'
import styles from './StdPageNew.module.css'
import { useSelector, useDispatch } from 'react-redux';
import { updateStdData, stdDataSaveHandle } from '../../../../redux/slice'; // 导入你的 action

export default function StdPage7() {
  var formData = useSelector((state) => state.stdDataQP7); 
  const textRef = useRef(null);
  const dispatch = useDispatch();
  const texts = localStorage.getItem("Lan")==="CN"?texts_CN:texts_EN
  const handleDataSave = () => {
    const names = ["careerOrGoal", "careerOrField"];
    names.forEach(name => {
      const span = textRef.current.querySelector(`span[name="${name}"]`);
      if (span) {
        const data = span.innerText.replace('[', '').replace(']', '').trim();
        dispatch(updateStdData({pNum: 7, payload: { [name]: data }}));
        // 本地数据处理
        stdDataSaveHandle(name, data, 7);
      }
    });
  };

  const handleClearText = (event) => {
    event.target.innerText = '[ ';
      const span = event.target;

    // 创建一个空的文本节点并插入到 span 中
    const textNode = document.createTextNode(' ]');
    span.appendChild(textNode);

    // 创建范围（Range）对象，并将其设置为刚刚创建的空文本节点
    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, 0); // 1 表示空白节点的长度

    // 获取当前的选择对象并将其更改为新的范围
    const selection = window.getSelection();
    selection.removeAllRanges(); // 清除任何现有的选择
    selection.addRange(range);
    };

    useEffect(() => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (!textRef.current.querySelector('span[type="No"]')) {
            // 撤销操作
            document.execCommand('undo');
          }
        });
      });

      observer.observe(textRef.current, { childList: true, subtree: true });

      return () => observer.disconnect();
    }, []);

  return (
    <div className={styles.container}>
      <div className={styles.QContainer}>
        {texts.GeberalQ.StdPage.Page7.P7Q1}
      </div>
      <div className={styles.AcontainerBgImg}>
        {/* <div className={styles.BorderStyle}> */}
        <div className={styles.Acontainer} >
        <div
        className={styles.contentEditableDiv}
        ref={textRef}
        contentEditable
        style={{ 
          whiteSpace: 'pre-wrap'
        }}
        onInput={handleDataSave}
        >
          <span contentEditable={false} style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <span type="No">"My long-term career goal is to </span>
          </span>
          <span name="careerOrGoal" style={{color:'red'}} onDoubleClick={handleClearText}>[ {formData.careerOrGoal||"describe your career or academic goal"} ]</span>
          <span contentEditable={false} style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <span type="No"> I will gain during my studies to make a meaningful impact in the </span>
          </span>
          <span name="careerOrField" style={{color:'green'}} onDoubleClick={handleClearText}>[ {formData.careerOrField||"your intended career or academic field]"} ]</span>
          {/* <span contentEditable={false} style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <span type="No"> and I firmly believe that the study from the university will play a pivotal role in achieving this objective. The program's focus on </span>
          </span>
          <span name="proStrenghths" style={{color:'green'}} onDoubleClick={handleClearText}>[ {formData.proStrenghths||"mention program strengths"} ]</span>
          <span contentEditable={false} style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <span type="No"> will provide me with the expertise required to excel in my desired career field. I am excited to harness the knowledge and network I will gain during my studies to make a meaningful impact in the </span>
          </span>
          <span name="myCareer" style={{color:'green'}} onDoubleClick={handleClearText}>[ {formData.myCareer||"your intended career or academic field"} ]</span>
          <span contentEditable={false} style={{ pointerEvents: 'none', userSelect: 'none' }}>
          <span type="No"> and contribute to the academic community." </span>
          </span> */}
        </div>
        </div>
      </div>
    </div>
  )
}

