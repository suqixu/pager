比较简单的js分页控件 
by zzy suqixu@126.com 

1、引用pager.js
2、在需要显示控件的地方加入
<script type="text/javascript">pagerUtil.init(pre,next,total);</script>
参数说明：
pre 	——当前页前面标签个数
next	——当前页后面标签个数
total	——总页数

eg：
<script type="text/javascript">pagerUtil.init(4,3,100);</script>、

ps：测试页面test.html需扔到服务器上方可运行
