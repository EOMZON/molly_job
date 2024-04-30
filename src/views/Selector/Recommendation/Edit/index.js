import { useNavigate } from 'react-router-dom';
import { editState } from '../../../../utils/checkCache';
import RecommendationForm from './RecommendationForm';
import { checkLogin } from '../../../../utils/checkLogin';
import {
  createRecommendation,
  updateRecommendation,
} from '../../../../utils/api';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  getRecommendation,
  getRecommendation_MOCK,
} from '../../../../utils/api';
import { LoadingIndicator } from '../../../../components/Loading';
import { initialValues } from './FormData';
import { saveLocalEdit } from '../../../../utils/saveLocalData';

//整个推荐信表单
const RecommendationFormLogic = () => {
  const topicId = localStorage.getItem('topicId');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(initialValues);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchAndCompareData = async () => {
    console.log(formData);
    try {
      const localSaved = JSON.parse(
        localStorage.getItem(`recommendation_localEdit${topicId}`)
      );
      const response = await getRecommendation(topicId); // 注意这里应该是真实的API调用
      // Step 1: 检查后端响应是否有有效值
      if (response && response.timeStamp) {
        console.log('存在后端有效值');
        // Step 2: 如果后端响应中有有效值且更新了，比较时间戳
        if (localSaved) {
          console.log('有recommend缓存');

          if (response.timeStamp > localSaved?.timeStamp) {
            //后台数据更新,用后台数据
            setFormData(response.data.msg);
          } else {
            //后台数据没更新，用本地数据
            if (localSaved?.data) {
              setFormData(localSaved.data);
            }
          }
        } else {
          //存在有效后端数据,没有本地缓存,直接使用后端数据
          setFormData(response.data.msg);
        }
      } else {
        // 后端响应中没有有效值，无法获取更新的数据
        if (localSaved) {
          console.log('后端没有有效值,但有缓存');
          console.log(localSaved);
          setFormData(localSaved.data);
        } else {
          console.log('后端没有有效值,也没有缓存', formData);
        }
      }
    } catch (error) {
      // 处理错误情况
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 检查登录状态,未登录先去登录
    // const checkLoginAndDataFetch = async () => {
    //   try {
    //     const checkRes = await checkLogin();
    //     if (!checkRes) {
    //       // navigate(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`)
    //       navigate('/login');
    //       // console.log(window.location
    //     } else {
    //       // 验证用户身份后获取最新数据
    //       fetchAndCompareData();
    //     }
    //   } catch (error) {
    //     // 处理错误
    //     console.error('Error during checkLogin:', error);
    //   }
    // };
    // checkLoginAndDataFetch();
    fetchAndCompareData();
  }, [dispatch]); // 依赖 dispatch 函数

  const sendDatatoBack = async (values) => {
    try {
      const response = await updateRecommendation(values);
    } catch (error) {
      console.error(error);
    }
  };

  const goToGenerate = async (values) => {
    //mock data
    // const response = { status: 200 };

    //调用生成pdf api
    try {
      const response = await createRecommendation(values);
      console.log(response);
      if (response.status === 200) {
        editState('isEditrecommendation', false);
        navigate('/layout/Recommendation/generate');
      } else if (response.status === 401) {
        navigate('/login');
      } else {
        //错误提示
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingIndicator isLoading={true} />
      ) : (
        <RecommendationForm
          initialValues={formData}
          sendDatatoBack={sendDatatoBack}
          goToGenerate={goToGenerate}
        />
      )}
    </div>
  );
};

export default RecommendationFormLogic;
