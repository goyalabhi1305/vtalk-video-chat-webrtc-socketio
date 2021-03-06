const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
const socket = io('/')
myVideo.muted = true

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port:'8000'
})


let myVid
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVid = stream
    addVideoStream(myVideo, stream)

    

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        connectNewUser(userId, stream)
    })

    
})


peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);   
})





const connectNewUser = (userId, stream) => {
    alert(`new user ${userId} joined`)
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
    
}
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video)
}