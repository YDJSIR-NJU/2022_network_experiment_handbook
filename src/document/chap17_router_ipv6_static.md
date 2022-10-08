# 15：IPv6静态路由和默认路由实验

## 实验前准备

不论是IPv4或者是IPv6的网络环境都完整的支持静态路由，静态路由是指由网络管理员手工配置的路由信息。当网络的拓扑结构或者链路的状态发生变化时，网络管理员需要手工去修改路由表中相关的静态路由信息。静态路由信息在缺省情况下是私有的，不会传递给其他路由器。

## 实验要求

\1. 在路由器R2上配置3个环回接口IPv6地址，分别模拟三个不同的IPv6前缀，作为IPv6的目标网络。

\2. 在路由器R1上为三个IPv6前缀配置静态路由，并检测其连通性。

\3. 使用IPv6的默认路由去替代具体的静态路由条目。

## 实验拓扑



## 实验过程

### 1 为路由器R1和R2完成基础配置

包括启动IPv6和IPv6的地址配置，并激活相关接口，具体配置如下所示：

**在路由器****R1****上的配置：**

R1(config)#ipv6 unicast-routing　//启动IPv6的路由功能，否则静态路由无法完成。

R1(config)#interface serial 0/0/0　//进入serial 0/0/0接口模式。

R1(config-if)#ipv6 address 2001:10::1/64　 //为该接口配置IPv6地址

R1(config-if)#no shutdown

R1(config-if)#exit

 

**在路由器****R2****上的配置：**

R2(config)#ipv6 unicast-routing

R2(config)#interface serial 0/0/1

R2(config-if)#ipv6 address 2001:10::2/64

R2(config-if)#no shutdown

R2(config-if)#exit

R2(config)#interface loopback1

R2(config-if)#ipv6 address 2001:2::1/64

R2(config-if)#exit

R2(config)#interface loopback2

R2(config-if)#ipv6 address 2001:3::1/64

R2(config-if)#exit

R2(config)#interface loopback3

R2(config-if)#ipv6 address 2001:4::1/64

R2(config-if)#exit

 

在路由器R1上去ping路由器R2上的那几个环回IPv6地址，结果应该是ping不通，因为在路由器R1上暂时没有到目标地址的路由，关于这一技术知识点与IPv4的环境相同，要配置IPv6静态路由和默认路由功能类似于IPv4静态路由和默认路由，但是书写形式上还是存在一定区别，而默认路由是一种特殊的静态路由。

**建议的****IPv6****静态路由输入的格式**

ipv6 route <目标IPv6前缀><出站接口><下一跳IPv6地址>

**目标****IPv6****前缀：**指示目标的IPv6网络，这与IPv4的目标子网的意义相同。

**出站接口：**当前路由器转发数据包的出站接口，如果使用了邻接路由器的IPv6本地链路地址来作为下一跳地址，那么在静态路由的语法中必须包含出站接口关键字。

**下一跳****IPv6****地址：**要到达目标网络所要历经的下一跳路由器的IPv6的地址，这与IPv4的环境相同，注意：根据RFC2461规定，路由器必须能够确定下一跳路由器的本地链路地址，所以，在配置IPv6静态路由时，下一跳地址建议配置为邻接路由器的本地链路IPv6地址。在该实验环境中可以在路由器R2上使用show ipv6 interface serial 0/0/1来查看路由器R2的本地链路IPv6地址，如图17.2所示。



 

 

  Router#show ipv6  interface serial 0/0/1  Serial0/0/1 is  up, line protocol is up   Ipv6  is enabled, link-local address is FE80::6FE:7FFF:FEEB:7E8   No Virtual link-local address(es):   Global unicast address(es):     2001:10::2, subnet is 2001:10::/64   Joined group address(es):     FF02::1     FF02::2     FF02::1:FF00:2     FF02::1:FFEB:7E8   MTU is 1500 bytes   ICMP error messages limited to one every  100 milliseconds   ICMP redirects are enabled   ICMP unreachables are sent   ND DAD is enabled, number of DAD attempts:  1   ND reachable time is 30000 milliseconds  (using 34331)   Hosts use stateless autoconfig for  addresses.  Router#  

图17.2 查看路由器R2的本地链路IPv6地址

 

**在路由器****R1****上配置****IPv6****的静态路由：**

R1(config)#ipv6 route 2001:2::/64 serial 0/0/0 fe80::6ef:7fff:feeb:7e8

R1(config)#ipv6 route 2001:3::/64 serial 0/0/0 fe80::6ef:7fff:feeb:7e8

R1(config)#ipv6 route 2001:4::/64 serial 0/0/0 fe80::6ef:7fff:feeb:7e8

当完成上述配置后，可以在路由器R1上通过指令show ipv6 route查看Ipv6的路由表，如图17.3所示，可清晰地看见被添加的三条静态路由。然后在路由器R1上再次测试与目标Ipv6的通信，如果没有故障，应该成功通信，如图17.4所示。

 

  R1#show ipv6  route  Ipv6 Routing  Table – Default – 6 entries  Codes: C –  Connected, L – Local, S – Static, U – Per-user Static route      B – BGP, M – MIpv6, R – RIP, I1 – ISIS  L1     I2 – ISIS L2, IA – ISIS interarea, IS –  ISIS summary, D – EIGRP     EX – EIGRP external     O – OSPF Intra, OI – OSPF Inter, OE1 –  OSPF ext 1, OE2 – OSPF ext 2     ON1 – OSPF NSSA ext 1, ON2 – OSPF NSSA  ext 2  S 2001:2::/64   [1/0]     via FE80::6FE:7FFF:FEEB:7E8, Serial0/0/0    S 2001:3::/64   [1/0]     via FE80::6FE:7FFF:FEEB:7E8, Serial0/0/0  S 2001:4::/64   [1/0]     via FE80::6FE:7FFF:FEEB:7E8, Serial0/0/0  C 2001:10::/64 [0/0]     via Serial0/0/0, directly connected   L  2001:10::1/128 [0/0]     via Serial0/0/0, receive  L FF00::/8   [0/0]     via Null0, receive   R1#  

 

图17.3 查看路由器R1的IPv6的路由表

 

  R1#ping  2001:2::1     Type  escape sequence to abort.  Sending  5, 100-byte ICMP Echos to 2001:2::1, timeout is 2 seconds:  !!!!!  Success  rate is 100 rate percent(5/5), round-trip min/avg/max = 16/16/16 ms  R1#ping  2001:3:1      Type  escape sequence to abort.  Sending  5, 100-byte ICMP Echos to 2001:3::1, timeout is 2 seconds:  !!!!!  Success  rate is 100 rate percent(5/5), round-trip min/avg/max = 12/13/16 ms  R1#ping  2001:4:1     Type  escape sequence to abort.  Sending  5, 100-byte ICMP Echos to 2001:4::1, timeout is 2 seconds:  !!!!!  Success  rate is 100 rate percent(5/5), round-trip min/avg/max = 16/16/16 ms  R1#  

 

图17.4 成功与目标IPv6地址通信

 

### 2 删除三条静态路由，然后配置IPv6的默认路由来完成与目标网络通信

关于删除三条静态路由和添加默认路由的配置如下所示，当完成配置后，可以通过再次查看IPv6的路由表，如图17.5所示，可清晰地看到被添加的IPv6的默认路由，此时，路由器R1应该能成功的ping通三条目标IPv6地址。

**在路由器****R1****上去删除****IPv6****的静态路由：**

R1(config)#no ipv6 route 2001:4::/64 serial 0/0/0 fe80::6ef:7fff:feeb:7e8

R1(config)#no ipv6 route 2001:3::/64 serial 0/0/0 fe80::6ef:7fff:feeb:7e8

R1(config)#no ipv6 route 2001:2::/64 serial 0/0/0 fe80::6ef:7fff:feeb:7e8

 

**在路由器****R1****上配置****Ipv6****的默认路由：**

R1(config)#ipv6 route ::/0 serial 0/0/0 fe80::6ef:7fff:feeb:7e8

  R1#show ipv6 route  IPv6 Routing Table – Default – 4 entries  Codes: C – Connected, L – Local, S – Static, U –  Per–user Static route       B – BGP, M – MIpv6, R – RIP, I1 – ISIS L1     I2 – ISIS L2, IA – ISIS interarea, IS –  ISIS summary, D – EIGRP     EX – EIGRP external     O – OSPF Intra, OI – OSPF Inter, OE1 –  OSPF ext 1, OE2 – OSPF ext 2     ON1 – OSPF NSSA ext 1, ON2 – OSPF NSSA  ext 2  S  ::/0   [1/0]     via FE80::6FE:7FFF:FEEB:7E8, Serial0/0/0  C  2001:10::/64 [0/0]      via Serial0/0/0, directly connected  L  2001:10::1/128 [0/0]     via Serial0/0/0, receive  L  FF00::/8   [0/0]     via Null0, receive  R1#      

 

图17.5 路由器R1上的IPv6默认路由

## 实验命令列表

| 启动IPv6的路由功能 | ipv6 unicast-routing |
| ------------------ | -------------------- |
| 配置IPv6地址       | ipv6 address <地址>  |

 

## 实验问题

