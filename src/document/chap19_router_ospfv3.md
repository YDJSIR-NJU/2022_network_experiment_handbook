# 17：IPv6环境的OSPFv3实验

## 实验前准备

OSPFv3主要用于在IPv6网络中提供路由功能，OSPFv3是基于OSPFv2上开发用于IPv6网络的路由协议。而无论是OSPFv2还是OSPFv3在工作机制上基本相同；但为了支持IPv6地址格式，OSPFv3对OSPFv2做了一些改动。

OSPFv3是基于链路运行的，一个链路可以划分为多个IPv6前缀（类似于子网的概念），节点即使不在同一个前缀范围，只要在同一链路上也可以形成邻居关系，这与OSPFv2完全不同，因为在IPv6中一条链路可以属于多个子网。

OSPFv3将使用本地链路地址作为报文发送的源地址。一台路由器可以学习到同一链路上相连的所有路由器的本地链路地址，并使用这些本地链路地址作为下一跳来转发报文。但是在虚拟链路连接上，必须使用全球范围地址或者本地站点地址作为OSPFv3协议报文发送的源地址。本地链路地址只在本地链路上有意义且只能在本地链路上泛洪。

## 实验要求

1. 分别在路由器R1、R2、R3上配置三个环回接口，分别配置三个全球单播范围内的IPv6地址，模拟三个不同的IPv6前缀（类似于IPv4的子网）

2. 在三台路由器上启动OSPFv3，最后来观察IPv6的路由学习结果，查看OSPFv3的邻居关系等。

## 实验拓扑



## 实验过程

###  1 完成路由器R1、R2、R3的Ipv6的基础配置

包括启动IPv6和配置IPv6的接口地址，激活接口，具体配置如下

路由器 R1 的基础配置：

R1(config)#ipv6 unicast-routing　//启动IPv6路由功能

R1(config)#interface serial 0/0/0　

R1(config-if)#ipv6 enable　//在接口下启动IPv6，将自动生成本地链路地址

R1(config-if)#no shutdown　

R1(config-if)#exit

R1(config)#interface loopback1

R1(config-if)#ipv6 address 2001:1::1/64

 

路由器 R2的基础配置：

R2(config)#ipv6 unicast-routing

R2(config)#interface serial 0/0/0

R2(config-if)#ipv6 enable

R2(config-if)#no shutdown

R2(config-if)#exit

R2(config)#interface loopback1

R2(config-if)#ipv6 address 2001:2::1/64

 

路由器R3的基础配置：

R3(config)#ipv6 unicast-routing

R3(config)#interface serial 0/0/0

R3(config-if)#ipv6 enable

R3(config-if)#no shutdown

R3(config-if)#exit

R3(config)#interface loopback1

R3(config-if)#ipv6 address 2001:3::1/64

### 2 启动OSPFv3路由协议



在路由器R3的OSPFv3配置：

R3(config)#ipv6 router ospf 1　 //启动OSPFv3的路由进程１

R3(config-rtr)#router-id 3.3.3.3　 //为OSPFv3配置路由器ID（RID）

R3(config-rtr)#exit

R3(config)#interface serial 0/0/0　

R3(config-if)#ipv6 ospf 1 area0  //使该接口加入到OSPFv3进程１并申明区域为0

R3(config-if)#exit

R3(config)#interface loopback1

R3(config-if)#ipv6 ospf 1 area0

R3(config-if)#exit

注意：在配置OSPFv3时，必须为路由器进程配置路由器ID(RID)这与OSPFv2完全不同，在OSPFv2的环境中，RID是一个可选项配置，但是在OSPFv3的环境中RID是必须配置，否则OSPFv3将无法启动。OSPFv3的RID将仍然以点分十进制的方法显示，比如:1.1.1.1这很像IPv4地址的表达方式。

 

在路由器R2的OSPFv3配置：

R2(config)#ipv6 router ospf 1

R2(config-rtr)#router-id 2.2.2.2

R2(config)#interface serial 0/0/0

R2(config-if)#ipv6 ospf 1 area0

R2(config-if)#exit

R2(config)#interface loopback1

R2(config-if)#ipv6 ospf 1 area0

R2(config-if)#exit

 

在路由器R1的OSPFv3配置：

R1(config)#ipv6 router ospf 1

R1(config-rtr)#router-id 1.1.1.1

R1(config-rtr)#exit

R1(config)#interface serial 0/0/0

R1(config-if)#ipv6 ospf 1 area 0

R1(config-if)#exit

R1(config)#interface loopback1

R1(config-if)#ipv6 ospf 1 area0

R1(config-if)#exit

### 3 检查OSPFv3邻居关系的状态、路由学习的情况，以及连通性检测

可以使用show ipv6 ospf neighbor来查看OSPFv3的邻居关系正常，如图19.2所示，并且可知路由器R3是DR路由器，R2是BDR路由器，关于为什么这样选举，在OSPFv2中有详细描述，这里不再重复描述。然后可以通过show ipv6 route查看路由器R1的IPv6路由表，如图19.3所示，可看出R1成功的学习到了路由器R2和R3公告出来的OSPF路由，其中的“Ｏ”就表示通过OSPFv3所学到的路由。最后在路由器R1上通过ping指令检测与路由器R2和R3上相关IPv6前缀的连通性，如图19.4所示，一切正常。

  R1#show ipv6 ospf neighbor     Neighbor ID  Pri  State      Dead Time  Interface ID  Interface  3.3.3.3    1   FULL/DROTHER   00:00:36  6      FastEthernet0/1  2.2.2.2    1   FULL/DR     00:00:33  6      FastEthernet0/1  

 

图19.2 查看OSPF的邻居关系

  R1#show ipv6 route  IPv6 Routing Table – Default – 5 entries  Codes: C – Connected, L – Local, S – Static, U –  Per–user Static route       B – BGP, M – MIpv6, R – RIP, I1 – ISIS L1     I2 – ISIS L2, IA – ISIS interarea, IS –  ISIS summary, D – EIGRP     EX – EIGRP external     O – OSPF Intra, OI – OSPF Inter, OE1 –  OSPF ext 1, OE2 – OSPF ext 2     ON1 – OSPF NSSA ext 1, ON2 – OSPF NSSA  ext 2  C 2001:1::/64 [0/0]  via Loopback1, directly  connected  L 2001:1::1/128 [0/0]  via Loopback1 receive  O 2001:2::1/128 [110/1]  via FE80::6FE:7FFF:FEEB:7E9,  FastEthernet0/1  O 2001:3::1/128 [110/1]  via FE80::6FE:7FFF:FEEB:7E9,  FastEthernet0/1  L FF00::/8 [0/0]  via Null0, receive  R1#   

 

图19.3 查看IPv6路由表

  R1#ping 2001:2::1     Type  escape sequence to abort.  Sending  5, 100-byte ICMP Echos to 2001:2::1, timeout is 2 seconds:  !!!!!  Success  rate is 100 rate percent(5/5), round-trip min/avg/max = 0/0/4 ms  R1#  

 

图19.4 在路由器R1上检测连通性

## 实验命令列表

| 启动IPv6                    | ipv6 enable             |
| --------------------------- | ----------------------- |
| 为OSPFv3配置路由器ID（RID） | router-id \<ID>         |
| 查看OSPF邻居关系            | show ipv6 ospf neighbor |
| 查看IPv6路由表              | show ipv6 route         |

## 实验问题