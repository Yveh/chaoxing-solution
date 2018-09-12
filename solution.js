/**
 * 超星刷课脚本
 * 更新时间：2018-09-12
 * 协议方式：模拟页面操作
 * 风险等级：轻微
 * @author  Jokin
 * @version 2.0.0-beta
 */

var right_seletcor = $("div.right#selector");
var courseArray = new Array();
var player;
$(function(){
    tips("初始化刷课数据(5s)");
    setTimeout("launcher();", 5000);
});
// 启动器
function launcher() {
    getAllCourses();
    switchCourse();
}
// 获取所有未通过课程
function switchCourse() {
    if ( courseArray.length === 0 ){
      tips("刷课完成，请刷新查看最终结果", "red");
      return false;
    }
    // 跳转至未刷课程
    var _course = courseArray.shift();
    var pattern = /[\s\S]+\'(\d+)\'\)/;
    var course_id = _course.match(pattern)[1];
    var course = $('h4#cur' + course_id);
    var course_status = $('h4#cur' + course_id + '>span').eq(1).hasClass('blue');
    if (course_status === true) {
      tips("跳过已刷课程：" + course_id + " | 剩余课程：" + courseArray.length, 'grey');
      switchCourse();
    } else {
      course.click();
      tips("15秒后尝试播放");
      setTimeout("simulateWatching()", 15000);
    }
}
function simulateWatching() {
    tips("播放视频");
    player = $("iframe").contents().find("iframe").contents().find('video#video_html5_api')[0];
    player.play();
    player.muted = true;
    listen();
}
function listen() {
    player.addEventListener('ended',function(){
      tips('切换课程');
      switchCourse();
    },false);
}
// 静音控制
function mute(times = 0) {
    if (times > 10) {
      tips('播放状态错误', 'red');
      return false;
    }
    if (mute_btn.hasClass('vjs-vol-0')) {
      tips("已静音");
      return true;
    } else {
      mute_btn.click();
      mute(times++);
    }
}
// 获取所有课程
function getAllCourses(){
    tips("获取所有课程中");
    var data = right_seletcor.html();
    var pattern = /getTeacherAjax\('(.+)','(.+)','(.+)'\);/gum;
    courseArray = data.match(pattern);
}
// 通知
function tips(text, color="blue"){
    console.log("%c【超星刷课】" + text, "color:" + color);
}