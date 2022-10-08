# 实验01：路由器基本命令

## 实验前准备

本次实验只涉及基础命令，暂无实验前准备。

## 实验要求

本次实验，主要完成以下几个基本命令的操作：

**1.**     **设置路由器系统时间**

系统时间是一个非常重要的参数，设备在运行过程中产生的每个日志信息都会有产生的时间作为参考，如果系统时间设置不正确，对于判断网络设备在某个时刻的状态是非常不利的，因此，设备在加电运行的时候,都会设置一个特定的时间,便于随时掌握设备的运行情况。

**2.**     **启动光标跟随服务**

网络管理员在对设备进行配置的时候，设备会不断的弹出控制台信息，告诉网络管理员设备的运行状态，但频繁的控制台信息会打断网络管理员正在输入的命令，给配置带来很大的不便，因此，可以打开光标跟随的功能。这样，即使弹出控制台信息,命令也不会被打断，该服务默认是关闭的。

**3.** **设置路由器登陆界面**

对于一些商业机构，或者公众网络来说，部分网络设备必须暴露在互联网上，这样一来，除了合法的网络管理员，任何能接入互联网的用户都可以登陆到设备上来，因此，必须设置一个登陆界面，告知用户设备的归属方，该设备所起到的作用以及非法用户登陆所应该承担的法律责任，切忌在登陆界面上出现欢迎字样(内网设备除外)，以防止给入侵的黑客找到入侵的借口。

**4.**    **配置端口描述**

网络管理员在部署大规模的复杂网络时必须规划清楚各个端口连到对端的什么设备，什么端口，以及端口的作用。所以，在初始化配置的时候,端口描述成为必不可少的配置，尤其对于运营商来说,端口描述已经成为配置规范中不可缺少的一部分。

## 实验拓扑

一台PC通过Console线接入设备，本次实验的所有配置都在这样的拓扑下完成。

​                               

图3.1 拓扑图

## 实验过程

### 设置路由器时间

将设备的系统时间设置为2016年1月1日8点整。

```bash
Router#clock set 08:00:00 1 jan 2016
```

### 启动光标跟随功能

Router(config)#line con 0

Router(config-line)#logging synchronous

\3.     设置路由器登陆界面

R1(config)#banner motd “Welcome to NJU”

测试结果如图3.2所示。

  Welcome to NJU  User Access  Verification  Password:  Router>  

图3.2 设置路由器登陆界面

\4.     配置端口描述

R1(config)#int fa 0/0

R1(config-if)#description To ISP

\5.     关闭思科设备的域名解析功能

对于思科的设备，如果在特权模式下，网络管理员不小心输入了错误的命令，那么思科设备会认为这条错误的命令是一个域名，它会做域名解析，如图3.3所示：

  Router#fsdafasdf  Translation  "fsdafasdf"...domain server (255.255.255.255)  (255.255.255.255)  Translating  "fsdafasdf"...domain server (255.255.255.255)  Translating  "fsdafasdf"...domain server (255.255.255.255)  % Unknown  command or computer name, or unable to find computer address  #Router#  

图3.3 域名解析

在这个情况下，设备会卡在这里一段时间，这里千万不要按回车键，多按一次回车，域名就多解析一次。这里正确的做法是按 Ctrl+Shift+6，打断设备的域名解析，等设备退回到正常的情况下后，再输入下面的命令，关闭设备的域名解析。

R1(config)#no ip domain-lookup

测试结果如图3.4所示。

  Router#configure  terminal  Enter  configuration commands, one per line.   End with CNTL/Z  Router(config)#no  ip domain-lookup  Router(config)#fsdafkjs  % Invalid input  detected at ‘^’ marker  

图3.4 关闭域名解析

\6.     将实验端口恢复到默认设置

对端口进行错误的设置之后，需要将其恢复为默认设置，这步操作会清空所有端口下做的配置。所以，在实际工作中，将端口恢复默认设置是一个风险操作，一定要小心谨慎。

  Router(config)#default  interface f0/0  Building  configuration...     Interface  FastEthernet0/0 set to default configuration  

图3.5 恢复默认设置

## 实验命令列表

表3.1 实验命令表

| 设置系统时间     | clock set 时间 日期 月份 年份 |
| ---------------- | ----------------------------- |
| 设置登陆界面     | banner motd 欢迎语            |
| 配置端口描述     | description 描述信息          |
| 关闭域名解析     | no ip  domain-lookup          |
| 端口恢复默认设置 | default  interface 端口       |

## 实验问题