import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TwitterPicker } from 'react-color';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import Switch from 'react-switch';
import ReactLoading from 'react-loading';
import autobind from 'autobind-decorator';

import action from '@/state/action';
import socket from '@/socket';
import Avatar from '@/components/Avatar';
import IconButton from '@/components/IconButton';
import Dialog from '@/components/Dialog';
import Button from '@/components/Button';
import Message from '@/components/Message';
import setCssVariable from 'utils/setCssVariable';
import readDiskFile from 'utils/readDiskFile';
import playSound from 'utils/sound';
import OnlineStatus from './OnlineStatus';
import AppDownload from './AppDownload';
import AdminDialog from './AdminDialog';
import SelfInfo from './SelfInfo';
import config from '../../../../config/client';

import './Sidebar.less';


@autobind
class Sidebar extends Component {
    static logout() {
        action.logout();
        window.localStorage.removeItem('token');
        Message.success('您已经退出登录');
        socket.disconnect();
        socket.connect();
    }
    static resetThume() {
        action.setPrimaryColor(config.primaryColor);
        action.setPrimaryTextColor(config.primaryTextColor);
        action.setBackgroundImage(config.backgroundImage);
        setCssVariable(config.primaryColor, config.primaryTextColor);
        window.localStorage.removeItem('primaryColor');
        window.localStorage.removeItem('primaryTextColor');
        window.localStorage.removeItem('backgroundImage');
        Message.success('已恢复默认主题');
    }
    static resetSound() {
        action.setSound(config.sound);
        window.localStorage.removeItem('sound');
        Message.success('已恢复默认提示音');
    }
    static handleSelectSound(sound) {
        playSound(sound);
        action.setSound(sound);
    }
    static propTypes = {
        isLogin: PropTypes.bool.isRequired,
        isConnect: PropTypes.bool.isRequired,
        avatar: PropTypes.string,
        primaryColor: PropTypes.string,
        primaryTextColor: PropTypes.string,
        backgroundImage: PropTypes.string,
        sound: PropTypes.string,
        soundSwitch: PropTypes.bool,
        notificationSwitch: PropTypes.bool,
        voiceSwitch: PropTypes.bool,
        isAdmin: PropTypes.bool,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            settingDialog: false,
            userDialog: false,
            rewardDialog: false,
            infoDialog: false,
            appDownloadDialog: false,
            backgroundLoading: false,
            adminDialog: false,
        };
    }
    openSettingDialog() {
        this.setState({
            settingDialog: true,
        });
    }
    closeSettingDialog() {
        this.setState({
            settingDialog: false,
        });
    }
    openUserDialog() {
        this.setState({
            userDialog: true,
        });
    }
    closeUserDialog() {
        this.setState({
            userDialog: false,
        });
    }
    openReward() {
        this.setState({
            rewardDialog: true,
        });
    }
    closeReward() {
        this.setState({
            rewardDialog: false,
        });
    }
    openInfo() {
        this.setState({
            infoDialog: true,
        });
    }
    closeInfo() {
        this.setState({
            infoDialog: false,
        });
    }
    openAppDownload() {
        this.setState({
            appDownloadDialog: true,
        });
    }
    closeAppDownload() {
        this.setState({
            appDownloadDialog: false,
        });
    }
    openAdmin() {
        this.setState({
            adminDialog: true,
        });
    }
    closeAdmin() {
        this.setState({
            adminDialog: false,
        });
    }
    handlePrimaryColorChange(color) {
        const primaryColor = `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`;
        const { primaryTextColor } = this.props;
        action.setPrimaryColor(`${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`);
        setCssVariable(primaryColor, primaryTextColor);
    }
    handlePrimaryTextColorChange(color) {
        const primaryTextColor = `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`;
        const { primaryColor } = this.props;
        action.setPrimaryTextColor(`${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`);
        setCssVariable(primaryColor, primaryTextColor);
    }
    toggleBackgroundLoading() {
        this.setState({
            backgroundLoading: !this.state.backgroundLoading,
        });
    }
    async selectBackgroundImage() {
        this.toggleBackgroundLoading();
        try {
            const file = await readDiskFile('base64', 'image/png,image/jpeg,image/gif');
            if (!file) {
                return;
            }
            if (file.length > config.maxBackgroundImageSize) {
                return Message.error('设置背景图失败, 请选择小于3MB的图片');
            }
            action.setBackgroundImage(file.result);
        } finally {
            this.toggleBackgroundLoading();
        }
    }
    render() {
        const { isLogin, isConnect, avatar, primaryColor, primaryTextColor, backgroundImage, sound, soundSwitch, notificationSwitch, voiceSwitch, isAdmin } = this.props;
        const { settingDialog, userDialog, rewardDialog, infoDialog, appDownloadDialog, backgroundLoading, adminDialog } = this.state;
        if (isLogin) {
            return (
                <div className="module-main-sidebar">
                    <Avatar className="avatar" src={avatar} onClick={this.openUserDialog} />
                    <OnlineStatus className="status" status={isConnect ? 'online' : 'offline'} />
                    <div className="buttons">
                        {
                            isAdmin ?
                                <IconButton width={40} height={40} icon="administrator" iconSize={28} onClick={this.openAdmin} />
                                :
                                null
                        }
                        <a href="https://github.com/yinxin630/fiora" target="_black" rel="noopener noreferrer">
                            <IconButton width={40} height={40} icon="github" iconSize={26} />
                        </a>
                        <IconButton width={40} height={40} icon="app" iconSize={28} onClick={this.openAppDownload} />
                        <IconButton width={40} height={40} icon="dashang" iconSize={26} onClick={this.openReward} />
                        <IconButton width={40} height={40} icon="about" iconSize={26} onClick={this.openInfo} />
                        <IconButton width={40} height={40} icon="setting" iconSize={26} onClick={this.openSettingDialog} />
                        <IconButton width={40} height={40} icon="logout" iconSize={26} onClick={Sidebar.logout} />
                    </div>
                    <Dialog className="dialog system-setting" visible={settingDialog} title="系统设置" onClose={this.closeSettingDialog}>
                        <div className="content">
                            <div>
                                <p>恢复</p>
                                <div className="buttons">
                                    <Button onClick={Sidebar.resetThume}>恢复默认主题</Button>
                                    <Button onClick={Sidebar.resetSound}>恢复默认提示音</Button>
                                </div>
                            </div>
                            <div>
                                <p>开关</p>
                                <div className="switch">
                                    <p>声音提醒</p>
                                    <Switch
                                        onChange={action.setSoundSwitch}
                                        checked={soundSwitch}
                                    />
                                    <p>桌面提醒</p>
                                    <Switch
                                        onChange={action.setNotificationSwitch}
                                        checked={notificationSwitch}
                                    />
                                    <p>语音播报</p>
                                    <Switch
                                        onChange={action.setVoiceSwitch}
                                        checked={voiceSwitch}
                                    />
                                </div>
                            </div>
                            <div>
                                <p>提示音</p>
                                <div className="sounds">
                                    <RadioGroup value={sound} onChange={Sidebar.handleSelectSound} horizontal>
                                        <RadioButton value="default">默认</RadioButton>
                                        <RadioButton value="apple">苹果</RadioButton>
                                        <RadioButton value="pcqq">电脑QQ</RadioButton>
                                        <RadioButton value="mobileqq">手机QQ</RadioButton>
                                        <RadioButton value="momo">陌陌</RadioButton>
                                        <RadioButton value="huaji">滑稽</RadioButton>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div>
                                <p>背景图 <span className="background-tip">背景图会被拉伸到浏览器窗口大小, 合理的比例会取得更好的效果</span></p>
                                <div className="image-preview">
                                    <img className={backgroundLoading ? 'blur' : ''} src={backgroundImage} onClick={this.selectBackgroundImage} />
                                    <ReactLoading className={`loading ${backgroundLoading ? 'show' : 'hide'}`} type="spinningBubbles" color={`rgb(${primaryColor}`} height={100} width={100} />
                                </div>
                            </div>
                            <div>
                                <p>主题颜色</p>
                                <div className="color-info">
                                    <div style={{ backgroundColor: `rgb(${primaryColor})` }} />
                                    <span>{`rgb(${primaryColor})`}</span>
                                </div>
                                <TwitterPicker className="color-picker" color={`rgb(${primaryColor})`} onChange={this.handlePrimaryColorChange} />
                            </div>
                            <div>
                                <p>文字颜色</p>
                                <div className="color-info">
                                    <div style={{ backgroundColor: `rgb(${primaryTextColor})` }} />
                                    <span>{`rgb(${primaryTextColor})`}</span>
                                </div>
                                <TwitterPicker className="color-picker" color={`rgb(${primaryTextColor})`} onChange={this.handlePrimaryTextColorChange} />
                            </div>
                        </div>
                    </Dialog>
                    <SelfInfo visible={userDialog} onClose={this.closeUserDialog} />
                    <Dialog className="dialog reward " visible={rewardDialog} title="打赏" onClose={this.closeReward}>
                        <div className="content">
                            <p>如果你觉得这个聊天室代码对你有帮助, 希望打赏下给个鼓励~~<br />作者大多数时间在线, 欢迎提问, 有问必答</p>
                            <div>
                                <img src={require('@/assets/images/alipay.jpg')} />
                                <img src={require('@/assets/images/wxpay.jpg')} />
                            </div>
                        </div>
                    </Dialog>
                    <Dialog className="dialog fiora-info " visible={infoDialog} title="关于" onClose={this.closeInfo}>
                        <div className="content">
                            <div>
                                <p>作者主页</p>
                                <a href="https://suisuijiang.com" target="_black" rel="noopener noreferrer">https://suisuijiang.com</a>
                            </div>
                            <div>
                                <p>如何运行</p>
                                <a href="https://github.com/yinxin630/fiora/blob/master/doc/INSTALL.ZH.md" target="_black" rel="noopener noreferrer">https://github.com/yinxin630/fiora/blob/master/doc/INSTALL.ZH.md</a>
                            </div>
                            <div>
                                <p>输入框快捷键</p>
                                <ul>
                                    <li>Alt + S: 发送滑稽</li>
                                    <li>Alt + D: 发送表情包</li>
                                </ul>
                            </div>
                        </div>
                    </Dialog>
                    <AppDownload visible={appDownloadDialog} onClose={this.closeAppDownload} />
                    <AdminDialog visible={adminDialog} onClose={this.closeAdmin} />
                </div>
            );
        }
        return (
            <div className="module-main-sidebar" />
        );
    }
}

export default connect(state => ({
    isLogin: !!state.getIn(['user', '_id']),
    isConnect: state.get('connect'),
    avatar: state.getIn(['user', 'avatar']),
    isAdmin: state.getIn(['user', 'isAdmin']),
    primaryColor: state.getIn(['ui', 'primaryColor']),
    primaryTextColor: state.getIn(['ui', 'primaryTextColor']),
    backgroundImage: state.getIn(['ui', 'backgroundImage']),
    sound: state.getIn(['ui', 'sound']),
    soundSwitch: state.getIn(['ui', 'soundSwitch']),
    notificationSwitch: state.getIn(['ui', 'notificationSwitch']),
    voiceSwitch: state.getIn(['ui', 'voiceSwitch']),
}))(Sidebar);
