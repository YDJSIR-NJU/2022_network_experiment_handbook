# 08：配置单域OSPF

[点此下载本次实验的 Cisco Packet Tracer 文件](./chap10.pkt)

## 实验要求

本次实验主要完成以下几个基本命令的操作：

1. 根据拓扑组建和配置网络。配置好网络后，先不要配置OSPF，先用"ping"命令来核验工作，并测试以太网接口之间的连通性。

2. 为每台路由器配置一个环回接口。将环回接口（而不是物理接口）的地址用作路由器ID时，OSPF将更稳定，因为不同于物理接口，这种接口总是处于活动状态，为不会出现故障，因此再所有重要路由上，都应使用环回接口。

3. 配置OSPF。可结合使用命令`router ospf`和`network area`命令。

4. 查看OSPF运行情况。使用`show ip protocols`命令显示IP路由协议参数，包括定时器、过滤器、度量值、网络及路由器的其他信息。使用`show ip ospf interface`命令查看接口是否被加入到正确的区域中；该命令还显示各种定时器和邻接关系。

5. 调节OSPF的计时器。调节OSPF的计时器，以使这些核心路由器能更快地检测出失效的情况，但这会导致额外的数据流量增加。

6. 设置OSPF认证。使用接口配置命令`ip ospf message-digest-key key-id md5 key`给采用OSPF MD5身份验证的路由器指定要使用的密钥ID和密钥。

## 实验拓扑

拓扑如图所示，此外需要为各台路由器配置环回地址。以此为基础配置单区域的 OSPF 网络，即 Area 0 里 OSPF 的配置。

![image-20221019142450631](./chap10_router_ospf.assets/image-20221019142450631.png)

## 实验过程

1. **请按照前面几次实验练习的配置方法，根据给出的图示组建和配置网络。**

2. **在每台路由器上，用一个唯一的IP地址配置一个环回接口。**
```bash
RouterA(config)#int lo0
RouterA(config-if)#ip address 10.0.0.1 255.255.255.255
RouterB(config)#int lo0
RouterB(config-if)#ip address 10.0.0.2 255.255.255.255
RouterC(config)#int lo0
RouterC(config-if)#ip address 10.0.0.3 255.255.255.255
```
3. **配置OSPF**
```bash
RouterA(config)#router ospf 1
RouterA(config-router)#network 192.168.1.0 0.0.0.255 area 0
RouterB(config)#router ospf 1
RouterB(config-router)#network 192.168.1.0 0.0.0.255 area 0
RouterC(config)#router ospf 1
RouterC(config-router)#network 192.168.1.0 0.0.0.255 area 0
```
4. **用 `show` 命令来检查它的操作运行。**
```bash
RouterB#show ip protocols

Routing Protocol is "ospf 1"
  Outgoing update filter list for all interfaces is not set 
  Incoming update filter list for all interfaces is not set 
  Router ID 10.0.0.2
  Number of areas in this router is 1. 1 normal 0 stub 0 nssa
  Maximum path: 4
  Routing for Networks:
    192.168.1.0 0.0.0.255 area 0
  Routing Information Sources:  
    Gateway         Distance      Last Update 
    10.0.0.2             110      00:09:51
  Distance: (default is 110)
```
注意，更新计时器被设置为0。路由更新不是在固定时间间隔上被发送的，它们是事件驱动的。下一步，用 `show ip ospf` 命令来获得有关OSPF进程的消息信息。
```bash
RouterB#show ip ospf
 Routing Process "ospf 1" with ID 10.0.0.2
 Supports only single TOS(TOS0) routes
 Supports opaque LSA
 SPF schedule delay 5 secs, Hold time between two SPFs 10 secs
 Minimum LSA interval 5 secs. Minimum LSA arrival 1 secs
 Number of external LSA 0. Checksum Sum 0x000000
 Number of opaque AS LSA 0. Checksum Sum 0x000000
 Number of DCbitless external and opaque AS LSA 0
 Number of DoNotAge external and opaque AS LSA 0
 Number of areas in this router is 1. 1 normal 0 stub 0 nssa
 External flood list length 0
    Area BACKBONE(0)
        Number of interfaces in this area is 1
        Area has no authentication
        SPF algorithm executed 1 times
        Area ranges are
        Number of LSA 1. Checksum Sum 0x009140
        Number of opaque link LSA 0. Checksum Sum 0x000000
        Number of DCbitless LSA 0
        Number of indication LSA 0
        Number of DoNotAge LSA 0
        Flood list length 0

```
查看DR/BDR：
```
RouterB#show ip ospf interface

GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 192.168.1.1/24, Area 0
  Process ID 1, Router ID 10.0.0.2, Network Type BROADCAST, Cost: 1
  Transmit Delay is 1 sec, State DR, Priority 1
  Designated Router (ID) 10.0.0.2, Interface address 192.168.1.1
  No backup designated router on this network
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
    Hello due in 00:00:07
  Index 1/1, flood queue length 0
  Next 0x0(0)/0x0(0)
  Last flood scan length is 1, maximum is 1
  Last flood scan time is 0 msec, maximum is 0 msec
  Neighbor Count is 1, Adjacent neighbor count is 1
    Adjacent with neighbor 10.0.0.2  (Designated Router)
  Suppress hello for 0 neighbor(s)
```
可以看到DR为RouterC，BDR为RouterB
```bash
RouterA(config)#interface g0/0/0
RouterA(config-if)#ip ospf hello-interval 5
```
5. 调节OSPF的计时器

```bash
RouterA(config-if)#ip ospf dead-interval 20
```
6. 设置OSPF认证

```bash
RouterA(config-if)#ip ospf message-digest-key 1 md5 7 itsasecret
RouterA(config-if)#router ospf 1
RouterA(config-router)#area 0 authentication message-digest
```
## 实验命令列表

| 指令 | 用法 |
| ------------------ | --------------------------------------------------- |
| 全局配置命令       | router ospf [router-id]                             |
| 接口配置命令       | network [ipaddress] [wildcard-mask]  area [area-id] |
| 显示ip路由协议参数 | show ip protocols                                   |
| 显示接口的ospf状态 | show ip ospf interface                              |
| 修改hello间隔      | ip ospf hello-interval [time]                       |
| 修改dead时间       | ip ospf dead-interval [time]                        |
| 配置ospf MD5身份   | ip ospf message-digest-key [key-id]  md5 [key]      |

## 实验问题

哪个路由器成为了DR？哪个路由器成为了BDR？为什么？