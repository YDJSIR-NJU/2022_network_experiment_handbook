# 07：动态RIP

## 实验前准备

本次实验需要准备三台路由器，并且熟悉路由器的相关配置命令。

## 实验要求

本次实验主要完成以下操作:

在Cisco26XX系列路由器上，通过使用动态RIP路由协议将三台Cisco26XX路由器组成一个小网络；

## 实验拓扑



## 实验过程

### 1 使用show ip route查看路由表

检查现在能否从Router2620A 上ping 192.168.40.1。

 

### 2 配置动态路由

Router2620A:

Router2620A(config)#router rip

Router2620A(config)#network 192.168.10.0

Router2620A(config)#network 192.168.20.0

 

Router2621:

Router2621(config)# router rip

Router2621(config)#network 192.168.20.0

Router2621(config)#network 192.168.30.0

 

Router2620B:

Router2620B(config)#router rip

Router2620B(config)#network 192.168.30.0

Router2620B(config)#network 192.168.40.0

 

### 3 使用show ip route查看路由表

检查现在能否从Router2620B 上ping 192.168.40.1。

\4.     使用如下指令查看路由表更新(每30秒更新一次)

debug ip rip//开始查看

no debug all//停止查看

 

## 实验命令列表

| 路由表配置     | ip route [目标网段] [子网掩码] [下一跳路由器地址(IP地址)] |
| -------------- | --------------------------------------------------------- |
| 查看路由表     | show ip route                                             |
| 查看路由表更新 | debug ip rip                                              |
| 停止查看路由表 | no debug all                                              |

## 实验问题

1. 在配置结束后用什么命令来查看具体的设置,请显示具体内容。

2. 在路由器的全局模式下用“show ip protocol”检查当前时间参数设置，所显示的时间值分别代表什么？

3. 观察网络路由路径的选择

4. 在路由器的全局模式下，“traceroute”命令可用来追踪数据包在网络上所经过的路由。可选择若干条有代表性的路径进行路由选择的跟踪，并将由源到目标的各路径的结果记录下来。下表可作为参考格式：

| 路径编号 | 源IP | 中间节点1 | 中间节点2 | 中间节点3 | 中间节点4 | 目的IP |
| -------- | ---- | --------- | --------- | --------- | --------- | ------ |
|          |      |           |           |           |           |        |
|          |      |           |           |           |           |        |