import React from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import styles from "../Register/Register.module.css";
import logoImage from "../../assets/images/Logo.PNG";
import { Link, useNavigate  } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      let{Email,password} = values
    const res ={
      email:Email,
      pwd:password
    }
    const response = await axios({
      method: 'post',      
      url: '/api/Register/RegisterByEamil',  
      data: res,       
      headers: {           
          'Content-Type': 'application/json',
          'accept': '*/*',
          //'Authorization': 'Bearer YOUR_TOKEN_HERE'  // 例如：在这里放置Bearer token (如果需要)
      },
      timeout: 5000,       
      // ... 其他配置
     });
    //成功之后跳转到Login界面
    if (response.status === 200) {
      alert(`Registration successful for ${Email}!`);
      navigate('/login');
    }
    } catch (error) {
      if (error.response) {
        if(error.response.status===400&error.response.data.code===1001){
          alert(`${values.Email} Already Exists!`);
          navigate('/login');
        }
    } else if (error.request) {
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }
    }
    }

  return (
    <div className={styles.backgroundLayer}>
      <div className={styles.containerStyle}>
        <div className={styles.formStyle}>
          <div className="titleBox">
            <div className="largeText">Create New Account</div>
            <div className="smallText">
              Already registered? <Link to="/login">Login</Link>
            </div>
          </div>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <div className="smallSubText">EMAIL</div>
            <Form.Item name="Email" rules={[{ required: true, type: "email" }]}>
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <div className="smallSubText">PASSWORD</div>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              {/*  */}
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <div className="smallSubText">CONFIRM</div>
            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Confirm Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "gray")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "black")
                }
              >
                Sign up
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div>
          <img src={logoImage} alt="logo" className={styles.logo}></img>
        </div>
      </div>
    </div>
  );
}
