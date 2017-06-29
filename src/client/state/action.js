import Socket from '../../core/socketClient';

const socket = new Socket('localhost', 9200);
let dispatch = null;


function init(storeDispatch) {
    dispatch = storeDispatch;
}

async function register(username, password) {
    return socket.post('/user', {
        username,
        password,
    });
}
async function login(username, password) {
    const res = await socket.post('/auth', {
        username,
        password,
    });
    dispatch({
        type: 'SetMultiValue',
        keys: [
            ['user'],
            ['token'],
        ],
        values: [
            res.data.user,
            res.data.token,
        ],
    });
    return res;
}
async function reConnect(token) {
    const res = await socket.put('/auth', {
        token,
    });
    dispatch({
        type: 'SetMultiValue',
        keys: [
            ['user'],
            ['token'],
        ],
        values: [
            res.data.user,
            token,
        ],
    });
    return res;
}

async function createGroup(name) {
    const res = await socket.post('/group', {
        name,
    });
    dispatch({
        type: 'InsertValue',
        index: 0,
        key: ['user', 'groups'],
        value: res.data,
    });
    return res;
}

async function sendMessage(linkman, linkmanType, message) {
    const res = await socket.post('/message', {
        linkman,
        linkmanType,
        message,
    });
    return res;
}

export default {
    socket,
    register,
    login,
    reConnect,
    createGroup,
    sendMessage,
};

export { init };
