# 13：IPv6静态路由和默认路由实验

> [点此下载本次实验的 Cisco Packet Tracer 文件](./router_ipv6_static.pkt)

## 实验要求

1. 在路由器R2上配置3个环回接口IPv6地址，分别模拟三个不同的IPv6前缀，作为IPv6的目标网络。

2. 在路由器R1上为三个IPv6前缀配置静态路由，并检测其连通性。

3. 使用IPv6的默认路由去替代具体的静态路由条目。

## 实验拓扑

![image-20221119123549266](C:\Users\lyc8503\AppData\Roaming\Typora\typora-user-images\image-20221119123549266.png)

## 实验过程

1. **为路由器R1和R2完成基础配置**

启动 IPv6 并配置 IPv6 地址，具体配置如下所示：

在路由器R1上的配置：

```bash
// 启动IPv6的路由功能，否则静态路由无法完成。
Router1(config)#ipv6 unicast-routing
Router1(config)#interface s0/1/0
Router1(config-if)#ipv6 address 2001:10::1/64
Router1(config-if)#no shut
Router1(config-if)#exit
```

注意，第三行设置的值只是它公开访问的地址。这实际上是一个公网IPv6地址，不应该在私网中这么用，但实验时为了简化实现，都这么操作。IPv6一个连接可以同时有多个地址，设置这个不会影响`fe80`那个地址的存在。

在路由器R2上的配置：

```bash
Router2(config)#ipv6 unicast-routing
Router2(config)#int s0/1/0
Router2(config-if)#ipv6 address 2001:10::2/64
Router2(config-if)#no shut
Router2(config-if)#exit
Router2(config)#int lo1
Router2(config-if)#ipv6 address 2001:2::1/64
Router2(config-if)#int lo2
Router2(config-if)#ipv6 address 2001:3::1/64
Router2(config-if)#int lo3
Router2(config-if)#ipv6 address 2001:4::1/64
```

在路由器R1上去ping路由器R2上的那几个环回IPv6地址，结果应该是ping不通，因为在路由器R1上暂时没有到目标地址的路由，关于这一技术知识点与IPv4的环境相同，要配置IPv6静态路由和默认路由功能类似于IPv4静态路由和默认路由，但是书写形式上还是存在一定区别，而默认路由是一种特殊的静态路由。

配置 ipv6 路由的指令 `ipv6 route <目标IPv6前缀><出站接口><下一跳IPv6地址>`

目标IPv6前缀：指示目标的IPv6网络，这与IPv4的目标子网的意义相同。

出站接口：当前路由器转发数据包的出站接口，如果使用了邻接路由器的IPv6本地链路地址来作为下一跳地址，那么在静态路由的语法中必须包含出站接口关键字。

下一跳 IPv6 地址：要到达目标网络所要历经的下一跳路由器的 IPv6 的地址，这与 IPv4 的环境相同，注意：根据 RFC2461 规定，路由器必须能够确定下一跳路由器的本地链路地址，所以，在配置 IPv6 静态路由时，下一跳地址建议配置为邻接路由器的本地链路 IPv6 地址。在该实验环境中可以在路由器 R2 上使用`show ipv6 interface serial 0/1/0` 来查看路由器 R2 的本地链路 IPv6 地址，如下所示。

```bash
Router2#show ipv6 interface s0/1/0
Serial0/1/0 is up, line protocol is up
  IPv6 is enabled, link-local address is FE80::260:2FFF:FEB7:8201
  No Virtual link-local address(es):
  Global unicast address(es):
    2001:10::2, subnet is 2001:10::/64
  Joined group address(es):
    FF02::1
    FF02::2
    FF02::1:FF00:2
    FF02::1:FFB7:8201
  MTU is 1500 bytes
  ICMP error messages limited to one every 100 milliseconds
  ICMP redirects are enabled
  ICMP unreachables are sent
  ND DAD is enabled, number of DAD attempts: 1
  ND reachable time is 30000 milliseconds
  ND advertised reachable time is 0 (unspecified)
  ND advertised retransmit interval is 0 (unspecified)
  ND router advertisements are sent every 200 seconds
  ND router advertisements live for 1800 seconds
  ND advertised default router preference is Medium
  Hosts use stateless autoconfig for addresses.
```

 

2. **在路由器R1上配置IPv6的静态路由。**

::: tip TIP
请认真看上一段的内容。下方指令**最后的那个IPv6地址不是固定的**，需要根据前面看到的`下一跳路由器实际的本地链路IPv6地址`填入。如果设置错误，在进行下一次设置之前必须把前面的设置取消。在同时配置了两个路由的情况下，路由器会轮流访问这两个路由对应的IP，造成ping的时候一个包通一个包不通的景象。下面所有的指令都是一样的，凡是涉及`fe80`开头的指令，都必须根据实际查看到的值填入。
:::

```bash
Router1(config)#ipv6 route 2001:2::/64 s0/1/0 FE80::260:2FFF:FEB7:8201
Router1(config)#ipv6 route 2001:3::/64 s0/1/0 FE80::260:2FFF:FEB7:8201
Router1(config)#ipv6 route 2001:4::/64 s0/1/0 FE80::260:2FFF:FEB7:8201
```

当完成上述配置后，可以在路由器R1上通过指令 `show ipv6 route` 查看Ipv6的路由表，如下所示，可清晰地看见被添加的三条静态路由。然后在路由器R1上再次测试与目标Ipv6的通信，如果没有故障，应该成功通信，如下所示。

```bash
Router1#show ipv6 route
IPv6 Routing Table - 6 entries
Codes: C - Connected, L - Local, S - Static, R - RIP, B - BGP
       U - Per-user Static route, M - MIPv6
       I1 - ISIS L1, I2 - ISIS L2, IA - ISIS interarea, IS - ISIS summary
       ND - ND Default, NDp - ND Prefix, DCE - Destination, NDr - Redirect
       O - OSPF intra, OI - OSPF inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2
       ON1 - OSPF NSSA ext 1, ON2 - OSPF NSSA ext 2
       D - EIGRP, EX - EIGRP external
S   2001:2::/64 [1/0]
     via FE80::260:2FFF:FEB7:8201, Serial0/1/0
S   2001:3::/64 [1/0]
     via FE80::260:2FFF:FEB7:8201, Serial0/1/0
S   2001:4::/64 [1/0]
     via FE80::260:2FFF:FEB7:8201, Serial0/1/0
C   2001:10::/64 [0/0]
     via Serial0/1/0, directly connected
L   2001:10::1/128 [0/0]
     via Serial0/1/0, receive
L   FF00::/8 [0/0]
     via Null0, receive
```

```bash
Router1#ping 2001:2::1

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:2::1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 7/12/16 ms

Router1#ping 2001:3::1

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:3::1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 5/11/14 ms

Router1#ping 2001:4::1

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:4::1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 9/12/16 ms
```

 

3. **删除三条静态路由，然后配置IPv6的默认路由来完成与目标网络通信**

关于删除三条静态路由和添加默认路由的配置如下所示。

在路由器 R1 上去删除 IPv6 的静态路由：

```bash
Router1(config)#no ipv6 route 2001:2::/64 s0/1/0 FE80::260:2FFF:FEB7:8201
Router1(config)#no ipv6 route 2001:3::/64 s0/1/0 FE80::260:2FFF:FEB7:8201
Router1(config)#no ipv6 route 2001:4::/64 s0/1/0 FE80::260:2FFF:FEB7:8201
```

在路由器 R1 上配置 Ipv6 的默认路由。

```bash
Router1(config)#ipv6 route ::/0 s0/1/0 FE80::260:2FFF:FEB7:8201
```


当完成配置后，可以通过再次查看IPv6的路由表，如下所示，可清晰地看到被添加的IPv6的默认路由，此时，路由器R1应该能成功的ping通三条目标IPv6地址。

```bash
Router1#show ipv6 route
IPv6 Routing Table - 4 entries
Codes: C - Connected, L - Local, S - Static, R - RIP, B - BGP
       U - Per-user Static route, M - MIPv6
       I1 - ISIS L1, I2 - ISIS L2, IA - ISIS interarea, IS - ISIS summary
       ND - ND Default, NDp - ND Prefix, DCE - Destination, NDr - Redirect
       O - OSPF intra, OI - OSPF inter, OE1 - OSPF ext 1, OE2 - OSPF ext 2
       ON1 - OSPF NSSA ext 1, ON2 - OSPF NSSA ext 2
       D - EIGRP, EX - EIGRP external
S   ::/0 [1/0]
     via FE80::260:2FFF:FEB7:8201, Serial0/1/0
C   2001:10::/64 [0/0]
     via Serial0/1/0, directly connected
L   2001:10::1/128 [0/0]
     via Serial0/1/0, receive
L   FF00::/8 [0/0]
     via Null0, receive
```

## 实验命令列表

| 指令 | 用法 |
| ------------------ | -------------------- |
| 启动IPv6的路由功能 | ipv6 unicast-routing |
| 配置IPv6地址       | ipv6 address <地址>  |

## 实验问题

