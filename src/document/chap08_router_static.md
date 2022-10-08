# 06：静态路由和简单组网

## 实验前准备

本次实验需要准备三台路由器，并且熟悉路由器的相关配置命令。

## 实验要求

本次实验主要完成以下几项操作:

1. 在Cisco26XX系列路由器上进行静态路由配置，通过使用静态路由将三台Cisco26XX路由器连接起来,组成一个小网络；

2. 练习在简单网络中查看网络和设备状态的各种指令。

## 实验拓扑



## 实验过程

> (需要区分DTE/DCE)

### 1 端口IP地址配置

配置Router2620A: （f0/0:192.168.10.1,s0/0:192.168.20.1）

Router>enable

Router#config terminal

Router#hostname Router2620A

Router2620A(config)#int f0/0

Router2620A(config-if)#ip address 192.168.10.1 255.255.255.0

Router2620A(config-if)#no shut

Router2620A(config-if)#int s0/0

Router2620A(config-if)#ip address 192.168.20.1 255.255.255.0

Router2620A(config-if)#no shut

 

配置Router2621: （s0/0:192.168.20.2,s0/1:192.168.30.1）

Router>enable

Router#config terminal

Router#hostname Router2621

Router2621(config)#int s0/1

Router2621(config-if)#ip address 192.168.30.1 255.255.255.0

Router2621(config-if)#no shut

Router2621(config-if)#int s0/0

Router2621(config-if)#ip address 192.168.20.2 255.255.255.0

Router2621(config-if)#clock rate 56000

Router2621(config-if)#no shut

 

配置Router2620B: （s0/0:192.168.30.2,f0/0:192.168.40.1） 

Router>enable

Router#config terminal

Router#hostname Router2620B

Router2620B(config)#int s0/0

Router2620B(config-if)#ip address 192.168.30.2 255.255.255.0

Router2620B(config-if)#no shut

Router2620B(config-if)#int f0/0

Router2620B(config-if)#ip address 192.168.40.1 255.255.255.0

Router2620B(config-if)#no shut

 

用Ping命令测试各网段的连通性

 

### 2 路由表配置

格式: ip route <目标网段> <子网掩码> <下一跳路由器地址(IP地址)>

例如：

Router2620A(config)#ip route 192.168.40.0 255.255.255.0 192.168.20.2 

 

将路由表配置完备后，用ping命令检查各个端口间是否已顺利接通

### 3 配置默认路由

对于该实验的拓扑结构来说，只有Router1 和Router3 允许配置默认路由。

首先应该删除静态路由的配置，才配置默认路由。

以Router2620A为例：

Router2620A(config)# no ip route 192.168.40.0 255.255.255.0 192.168.20.2

Router2620A(config)# ip route 0.0.0.0 0.0.0.0 192.168.20.2

查看路由表  （命令：Router# show ip route）

注：有*号表示默认路由

 

## 实验命令列表

| 路由表配置         | ip route [目标网段] [子网掩码] [下一跳路由器地址(IP地址)] |
| ------------------ | --------------------------------------------------------- |
| 删除静态路由的配置 | no ip route  192.168.40.0 255.255.255.0 192.168.20.2      |
| 配置默认路由       | ip route 0.0.0.0  0.0.0.0 192.168.20.2                    |
| 查看路由表         | show ip route                                             |
| 停止查看路由表     | no debug all                                              |

## 实验问题

​    假如只分配了一个网段：192.168.10.0/24，你该如何搭建上述拓扑？请设计并加以实现。



 