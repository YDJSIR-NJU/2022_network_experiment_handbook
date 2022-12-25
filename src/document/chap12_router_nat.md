# 08：NAT网络地址转换

[点此下载本次实验的 Cisco Packet Tracer 文件](./router_nat.pkt)

## 实验要求

本次实验，希望通过地址转换，使拓扑图中左边内部网络中的内部本地地址分别通过三种方式转换成外部全局地址并成功的访问右边网络中的RouterC。

## 实验拓扑

实验拓扑如图所示，RouterA和RouterB之间是 `192.168.1.0/24` 网段，RouterB 和 RouterC 之间是 `200.1.1.0/24` 网段。

![image-20221028144429970](./chap12_router_nat.assets/image-20221028144429970.png)

## 实验过程 

1. **配置每个设备的名称和接口 ip 地址，确保彼此之间的三层连通性。** 

```bash
RouterA(config)#interface s0/1/0
RouterA(config-if)#ip address 192.168.1.2 255.255.255.0
RouterA(config-if)#no shutdown

RouterB(config)#interface s0/1/0
RouterB(config-if)#ip address 192.168.1.1 255.255.255.0
RouterB(config-if)#no shutdown
RouterB(config)#interface s0/1/1
RouterB(config-if)#ip address 200.1.1.2 255.255.255.0
RouterB(config-if)#no shutdown

RouterC(config)#interface s0/1/0
RouterC(config-if)#ip address 200.1.1.1 255.255.255.0
RouterC(config-if)#no shutdown
```

2. **在 RouterB 上完成静态 NAT 的配置。** 

```bash
RouterB(config)#ip nat inside source static 192.168.1.1 200.1.1.254 
RouterB(config)#interface s0/1/0
RouterB(config-if)#ip nat inside 
RouterB(config)#interface s0/1/1
RouterB(config-if)#ip nat outside
RouterB#debug ip nat 
IP NAT debugging is on
```

3. **此时在 RouterA 上用本地地址 192.168.1.1 Ping 200.1.1.2,结果没有ping通，为什么?**

```bash
RouterA#ping 200.1.1.2 
Type escape sequence to abort. 
Sending 5, 100-byte ICMP Echos to 200.1.1.2, timeout is 2 seconds: 
..... 
Success rate is 0 percent (0/5)
```

4. 查看 RouterA 上是否有地址转换的NAT表，转换表为空，说明没有发生地址转换，分析原因： **RouterA 去往200.1.1.0 网段，需要一条静态路由。**

```bash
RouterA#show ip nat translations
// 无输出
```

**为 RouterA 加上去往 RouterC 的静态路由，现在 RouterA 可以 ping 通 RouterC。**

```bash
RouterA(config)#ip route 200.1.1.0 255.255.255.0 s0/1/0
RouterA#ping 200.1.1.2 
Type escape sequence to abort. 
Sending 5, 100-byte ICMP Echos to 200.1.1.2, timeout is 2 seconds: 
!!!!! 
Success rate is 100 percent (5/5), round-trip min/avg/max = 40/42/44 ms
```

在 RouterB 上可以看到具体的转换过程。

```bash
*Oct 27 09:11:34.791: NAT*: s=192.168.1.1->200.1.1.254, d=200.1.1.2 [5] 
*Oct 27 09:11:34.819: NAT*: s=200.1.1.2, d=200.1.1.254->192.168.1.1 [5]
```

查看RouterB的NAT转换表，RouterB建立NAT表，当有流量符合这个匹配规则时就会两个地址进行转换。

```bash
RouterB#show ip nat translations
Pro Inside global      Inside local      Outside local      Outside global
--- 200.1.1.254        192.168.1.1     ---               ---
```

5. **在RouterB上完成动态NAT的配置。**

将原来的静态NAT的条目删除，通过使用用户访问控制列表来定义本地地址池。

```bash
RouterB(config)#no ip nat inside source static 192.168.1.1 200.1.1.254 
RouterB(config)#access-list 1 permit 192.168.1.0  0.0.0.255 
RouterB(config)#ip nat pool nju 200.1.1.253 200.1.1.254 netmask 255.255.255.0
RouterB(config)#ip nat inside source list 1 pool nju
```

**在 RouterA 上 ping RouterC，成功连通。**

```bash
Router#ping 200.1.1.1

Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 200.1.1.1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 26/31/35 ms
```

**Ping通说明路由添加正确，查看 RouterB 的终端信息。**

```bash
NAT: s=192.168.1.2->200.1.1.200, d=200.1.1.1 [37]
NAT*: s=200.1.1.1, d=200.1.1.200->192.168.1.2 [16]
NAT: s=192.168.1.2->200.1.1.200, d=200.1.1.1 [38]
NAT*: s=200.1.1.1, d=200.1.1.200->192.168.1.2 [17]
NAT: s=192.168.1.2->200.1.1.200, d=200.1.1.1 [39]
NAT*: s=200.1.1.1, d=200.1.1.200->192.168.1.2 [18]
NAT: s=192.168.1.2->200.1.1.200, d=200.1.1.1 [40]
NAT*: s=200.1.1.1, d=200.1.1.200->192.168.1.2 [19]
NAT: s=192.168.1.2->200.1.1.200, d=200.1.1.1 [41]
NAT*: s=200.1.1.1, d=200.1.1.200->192.168.1.2 [20]
```

### 5 在RouterA上用 192.168.1.3 ping 200.1.1.2

```bash
RouterA#ping 
Protocol [ip]: 
Target IP address: 200.1.1.2 
Repeat count [5]: 20 
Datagram size [100]: 
Timeout in seconds [2]: 
Extended commands [n]: y
Source address or interface: 192.168.1.3
Type of service [0]:
Set DF bit in IP header? [no]:
Validate reply data? [no]:
Data pattern [0xABCD]:
Loose, Strict, Record, Timestamp, Verbose[none]:
Sweep range of sizes [n]: 
Type escape sequence to abort. 
Sending 20, 100-byte ICMP Echos to 200.1.1.2, timeout is 2 seconds: 
Packet sent with a source address of 192.168.1.3
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Success rate is 100 percent (20/20), round-trip min/avg/max = 40/43/44 ms
RouterA#_
```

查看RouterB的终端信息以及NAT转换表，源地址192.168.1.2转换成200.1.1.254，很明显调用了第2公有地址。 

```bash
*Oct 27 09:26:10.339: NAT*: s=192.168.1.3->200.1.1.254, d=200.1.1.2 [139]
*Oct 27 09:26:10.367: NAT*: s=200.1.1.2, d=200.1.1.254->192.168.1.3 [139]
```

查看RouterB的NAT转换表

```bash
RouterB#show ip nat translations
Pro Inside global      Inside local      Outside local      Outside global
--- 200.1.1.253        192.168.1.1     ---               ---
--- 200.1.1.254        192.168.1.3     ---               ---
RouterB#_
```

### 6 在RouterA上用 192.168.1.4 ping 200.1.1.2

```bash
RouterA#ping 
Protocol [ip]: 
Target IP address: 200.1.1.2 
Repeat count [5]: 20 
Datagram size [100]: 
Timeout in seconds [2]: 
Extended commands [n]: y
Source address or interface: 192.168.1.4
Type of service [0]:
Set DF bit in IP header? [no]:
Validate reply data? [no]:
Data pattern [0xABCD]:
Loose, Strict, Record, Timestamp, Verbose[none]:
Sweep range of sizes [n]: 
Type escape sequence to abort. 
Sending 20, 100-byte ICMP Echos to 200.1.1.2, timeout is 2 seconds: 
Packet sent with a source address of 192.168.1.4
……………………………...
Success rate is 0 percent (0/20)
RouterA#_
```

结果发现不能ping通到目的。查看RouterB的NAT转换表，发现没有192.168.1.4的条目。

```bash
RouterB#show ip nat translations
Pro Inside global      Inside local      Outside local      Outside global
--- 200.1.1.253        192.168.1.1     ---               ---
--- 200.1.1.254        192.168.1.3     ---               ---
RouterB#_
```

解决的方法：清除RouterB的NAT表中的条目，将公有地址池中的公有地址释放出来。

```bash
RouterB#clear ip nat translation * 
RouterB#show ip nat translations
RouterB#_
```

在RouterA上重试。

```bash
RouterA#ping 
Protocol [ip]: 
Target IP address: 200.1.1.2 
Repeat count [5]: 
Datagram size [100]: 
Timeout in seconds [2]: 
Extended commands [n]: y
Source address or interface: 192.168.1.4
Type of service [0]:
Set DF bit in IP header? [no]:
Validate reply data? [no]:
Data pattern [0xABCD]:
Loose, Strict, Record, Timestamp, Verbose[none]:
Sweep range of sizes [n]: 
Type escape sequence to abort. 
Sending 20, 100-byte ICMP Echos to 200.1.1.2, timeout is 2 seconds: 
Packet sent with a source address of 192.168.1.4
!!!!!!!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 44/44/44 ms
RouterA#_
```

RouterB终端上所显示的转换过程。

```bash
*Oct 27 09:37:24.699: NAT*: s=192.168.1.4->200.1.1.253, d=200.1.1.2 [170]
*Oct 27 09:37:24.727: NAT*: s=200.1.1.2, d=200.1.1.253->192.168.1.4 [170]
```

再查看RouterB的NAT转换表。

```bash
RouterB#show ip nat translations
Pro Inside global      Inside local      Outside local      Outside global
icmp 200.1.1.253:7    192.168.1.4:7    200.1.1.2:7       200.1.1.2:7
--- 200.1.1.253        192.168.1.4     ---               ---
RouterB#_
```

### 7 配置 PAT

先删除转换语句，再删除之前建立的 pool，注意删除的顺序。

```bash
RouterB(config)#no ip nat inside source list 1 pool nju

Dynamic mapping in use, do you want to delete all entires? [no]: yes
RouterB(config)#no ip nat pool nju 200.1.1.253 200.1.1.254 prefix-length 24 
RouterB(config)#ip nat pool nju 200.1.1.253 200.1.1.253 prefix-length 24    
RouterB(config)#ip nat inside source list 1 pool nju overload  

RouterB(config)#
*Oct 27 09:42:38.571: ipnat_add_dynamic_cfg_common: id 2,flag 5, range 1
*Oct 27 09:42:38.571: id 2, flags 0, domain 0, lookup 0, aclnum 1, aclname 1, map
name idb 0x00000000
*Oct 27 09:42:38.571: poolstart 200.1.1.253 poolend 200.1.1.253 _    
```

### 8 在 RouterA 用 192.168.1.1 上 ping 200.1.1.2

```bash
RouterA#ping 200.1.1.2 

Type escape sequence to abort. 
Sending 5,  100-byte ICMP Echos to 200.1.1.2,  timeout is 2 seconds: 
!!!!! 
Success rate is 100 percent (5/5), round-trip min/avg/max =44/44/44 ms
RouterA#_
```

查看RouterB的终端信息以及NAT转换表，随机产生端口号6。

```bash
*Oct 27 09:44:05.283: NAT*: s=192.168.1.1->200.1.1.253, d=200.1.1.2 [175]
*Oct 27 09:44:05.311: NAT*: s=200.1.1.2, d=200.1.1.253->192.168.1.1 [175]
```

```bash
RouterB#show ip nat translations
Pro    Inside global     Inside local      Outside local   Outside global 
icmp   200.1.1.253:6    192.168.1.1:6    200.1.1.2:6    200.1.1.2:6
RouterB#_
```

RouterB约1分钟的时间释放地址转换的空间，此时查找NAT表中没有任何的转换条目。

```bash
RouterB#show ip nat translations

RouterB#_
```



### 9 在 RouterA用 192.168.1.3 ping 200.1.1.2

```bash
RouterA#ping 
Protocol [ip]: 
Target IP address: 200.1.1.2 
Repeat count [5]: 
Datagram size [100]: 
Timeout in seconds [2]: 
Extended commands [n]: y
Source address or interface: 192.168.1.3
Type of service [0]:
Set DF bit in IP header? [no]:
Validate reply data? [no]:
Data pattern [0xABCD]:
Loose, Strict, Record, Timestamp, Verbose[none]:
Sweep range of sizes [n]: 
Type escape sequence to abort. 
Sending 20, 100-byte ICMP Echos to 200.1.1.2, timeout is 2 seconds: 
Packet sent with a source address of 192.168.1.3
……………………………...
Success rate is 0 percent (5/5), round-trip min/avg/max = 40/43/44 ms
RouterA#_
```

查看RouterB的终端信息。

```bash
*Oct 27 09:47:40.827: NAT*: s=192.168.1.1->200.1.1.253, d=200.1.1.2 [180]
*Oct 27 09:47:40.855: NAT*: s=200.1.1.2, d=200.1.1.253->192.168.1.3 [180]
```

端口号已改为9。

```bash
RouterB#show ip nat translations
Pro    Inside global     Inside local      Outside local   Outside global 
icmp   200.1.1.253:9    192.168.1.1:9    200.1.1.2:9    200.1.1.2:9
RouterB#
*Oct 27 09:48:41.467:  NAT: expiring 200.1.1.253(192.168.1.3) icmp 9 (9)
RouterB#
```

## 实验命令列表

| 指令 | 用法 |
| ------------------ | ------------------------------------------------------------ |
| 配置静态NAT        | ip nat inside source static [inside  local ip address] [inside global ip address] |
| 删除静态 NAT条目   | no ip nat inside source static  [inside local ip address] [inside global ip address] |
| 指定内部ip地址接口 | ip nat inside                                                |
| 指定外部ip地址接口 | ip nat outside                                               |
| 查看NAT转换表      | show ip nat translations                                     |
| 清空NAT转换表      | clear ip nat translation *                                   |

## 实验问题
