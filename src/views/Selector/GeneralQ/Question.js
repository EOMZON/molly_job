import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import style from './Question.module.css';
import { postStdCoverLetterDataGroup } from '../../../utils/api';
import { editState, hasLocalData } from '../../../utils/checkCache';
import AlertContext from '../../../components/AlertProvider/AlertContext';
import { getLabels } from '../../local'; // 导入语言配置文件加载函数
import { useSelector } from 'react-redux';
import { selectCurrentLanguage } from '../../../redux/slices/languageSlice';
import { checkLogin } from '../../../utils/checkLogin';
import { fetchCoverletterData } from '../../../redux/actions/fetcDataActions';
import { useDispatch } from 'react-redux';
import { validateFields } from '../../../utils/checkRequired';

export default function Question(props) {
  const dispatch = useDispatch();
  const childrenCount = props.Count;
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlertMessage } = useContext(AlertContext);
  const texts = getLabels(useSelector(selectCurrentLanguage));
  const currentQNumber = parseInt(location.pathname.split('/page')[1], 10);
  //20240606 lily add required check---------------------------------
  const selectorPath = `stdDataQP${currentQNumber}`;
  const formData = useSelector((state) => state.coverLetter[selectorPath]);

  const handleToNext = async () => {
    if (currentQNumber < childrenCount) {
      const nextQ = 'page' + (currentQNumber + 1);
      if (validateFields(formData)) {
        navigate(`/layout/generalq/${nextQ}`);
      }
    }
    if (currentQNumber === childrenCount) {
      if (localStorage.getItem('topicId') === '1') {
        const timeStamp = new Date().getTime();
        localStorage.setItem('stdDataUpdateTimeStamp', timeStamp);
        const data = generateStdDataGroup(timeStamp);
        console.log(data);
        if (validateFields(data)) {
          const response = await postStdCoverLetterDataGroup(data);
          if (response.status === 200) {
            editState('isEditcoverletter', false);
            navigate('/layout/coverletter/generate');
          } else if (response.status === 401) {
            navigate('/login');
          } else {
            showAlertMessage(
              'Error',
              'Post data failed!, Please check your data!',
              'error'
            );
          }
        }
      } else {
        //job逻辑
        navigate('/layout/interview');
      }
    }
  };

  const handlToLast = () => {
    const currentQNumber = parseInt(location.pathname.split('/page')[1], 10);
    if (currentQNumber > 1) {
      const lastQ = 'page' + (currentQNumber - 1);
      navigate(`/layout/generalq/${lastQ}`);
    } else {
      if (!hasLocalData('isEditcoverletter')) {
        editState('isEditcoverletter', false);
        navigate('/layout/coverletter');
      }
    }
  };

  useEffect(() => {
    const checkRes = checkLogin();
    checkRes.then((result) => {
      if (!result) {
        // navigate(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`)
        navigate('/login');
        // console.log(window.location)
      }
    });
    // 在组件加载时触发异步 action
    dispatch(fetchCoverletterData());
  }, []); // 注意这里是一个空依赖数组，表示这个effect仅在组件挂载时运行一次

  return (
    <div className={style.container}>
      {props.children}
      <div className={style.footer}>
        <button className={style.btnLast} onClick={handlToLast}>
          {texts.QuestionP.back}
        </button>
        <button className={style.btnNext} type="submit" onClick={handleToNext}>
          {texts.QuestionP.next}
        </button>
      </div>
    </div>
  );
}

const generateStdDataGroup = (timeStamp) => {
  var stdDataQP5 = localStorage.getItem('stdDataQP5')
    ? JSON.parse(localStorage.getItem('stdDataQP5'))
    : {};
  var stdDataQP1 = localStorage.getItem('stdDataQP1')
    ? JSON.parse(localStorage.getItem('stdDataQP1'))
    : {};
  var stdDataQP2 = localStorage.getItem('stdDataQP2')
    ? JSON.parse(localStorage.getItem('stdDataQP2'))
    : {};
  var stdDataQP3 = localStorage.getItem('stdDataQP3')
    ? JSON.parse(localStorage.getItem('stdDataQP3'))
    : {};
  var stdDataQP4 = localStorage.getItem('stdDataQP4')
    ? JSON.parse(localStorage.getItem('stdDataQP4'))
    : {};

  const dataGroup = {
    // personal Info topicId
    // uId: localStorage.getItem("uId"), //delete
    // topicId: localStorage.getItem("topicId"),
    firstName: stdDataQP5.FirstName,
    surname: stdDataQP5.Surname,
    userNationality: stdDataQP5.Nationality,
    userBirthday: stdDataQP5.Birthday,
    userAddress: stdDataQP5.Address,
    userTel: stdDataQP5.Tel,
    userEmail: stdDataQP5.Email,
    // dream Info
    dreamDegree: stdDataQP1.drDegree,
    dreamUni: stdDataQP1.drUni,
    dreamMajor: stdDataQP1.drMajor,
    dreamCountry: stdDataQP1.drCountry,
    ideaArea: stdDataQP4.ideaArea,
    careerOrGoal: stdDataQP4.careerOrGoal,
    // current Info
    currentDegree: stdDataQP2.curDegree,
    currentMajor: stdDataQP2.curMajor,
    currentUni: stdDataQP2.curUni,
    currentCountry: stdDataQP2.curCountry,
    currentCourses: stdDataQP2.curCourses,
    currentGPA: stdDataQP2.curGPA ? stdDataQP2.curGPA : '',
    // get Info
    getProject: stdDataQP3.getProject,
    getConference: stdDataQP3.getConference,
    getAwards: stdDataQP3.getAwards,
    getCompetitions: stdDataQP3.getCompetitions,
    getSkills: stdDataQP3.getSkills,
    // intern Info
    internRole: stdDataQP3.internRole,
    internCompany: stdDataQP3.internCompany,
    //时间戳
    timeStamp: timeStamp,
  };
  return dataGroup;
};
