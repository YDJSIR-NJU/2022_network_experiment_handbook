# 05：交换机端口安全

现实生活中，交换机的使用数量远远多于路由器的使用，交换机因为接口数目多，可以连接多个节点，为了保护交换机的安全性，实行了交换机的端口安全，将MAC地址进行绑定，提高安全性。

## 实验要求

本次实验主要完成以下几项操作:

1. 启用端口安全措施

   必须先开启端口安全功能，才能开始制定端口安全策略。 

2. 限制 `g1/0/23` 口最大允许访问量为1

   通过限制访问量来保护设备安全。

3. 采用的安全措施为保护，限制或关闭

   端口安全侦测到问题使用三种惩罚措施。

## 实验拓扑

​       ![image-20221008150236628](./chap07_switch_security.assets/image-20221008150236628.png)

## 实验过程

### 1 惩罚措施为关闭

```bash
SW1(config)#interface g1/0/23
SW1(config-if)#switchport mode access
SW1(config-if)#switchport port-security
SW1(config-if)#switchport port-security mac-address aaaa.aaaa.aaaa
SW1(config-if)#switchport port-security maximum 1
SW1(config-if)#switchport port-security violation shutdown
```

注：惩罚措施有保护、限制和关闭。关闭：当新的计算机接入时，如果该接口的MAC地址条目超过了最大数目，则该接口将会被关闭，则这个新的计算机和原来的计算机都无法接入。

验证：用一根**直通线**将pc和交换机的`g1/0/23`口相连，查看`g1/0/23`接口的指示灯的变化情况。如果有橙色经过大约50秒的时间变为绿色再关闭，说明试验成功。在交换机上显示如下：

```
GigabitEthernet 1/0/23 isdown,line protocol is down(err-disabled)   Hardware is Fast Ethernet,address is  ec44.767a.d519(bia ec44.767a.d519)  
```

### 2 另外两种惩罚措施的现象

```bash
SW1(config)#interface g1/0/22
SW1(config-if)#switchport mode access
SW1(config-if)#switchport port-security
SW1(config-if)#switchport port-security mac-address aaaa.aaaa.aaab
SW1(config-if)#switchport port-security maximum 1
SW1(config-if)#switchport port-security violation protect
```

当新的计算机接入时，如果该接口的 MAC 地址条目超过了最大数目，则该端口将允许已知MAC地址发送的数据流但将抛弃未知MAC地址发送的数据流；

验证：用一根直通线将 pc 和交换机的 g1/0/22 口相连，使用cmd发送ping命令发送报文至交换机端口ip：192.168.1.1，若mac地址不是之前设置的aaaa.aaaa.aaab，则无法成功。结果如图：

```bash
C：\Users\Administrator>ping 192.168.1.1  
正在Ping 192.168.1.1具有32字节的数据：  
请求超时。  
请求超时。  
请求超时。  
请求超时。  
192.168.1.1的Ping统计信息： 
	数据包：已发送=4，已接收=0，丢失=4（100%丢失）  
```

当新的计算机接入时，如果该接口的 MAC 地址条目超过了最大数目，则该端口将允许已知MAC地址发送的数据流但将抛弃未知MAC地址发送的数据流，但同时会发送一条讯息通知违规发生，大致过程与保护类似，不再赘述。

## 实验命令列表

| 指令           | 用法            |
| ------------------------ | ------------------------------------------- 
| 选择交换机端口           | interface  fastEthernet [端口号]            ||
| 将端口定义为主机端口     | switchport mode  access                     |
| 开启交换机端口安全功能   | switchport port-security                    |
| 绑定mac地址到端口上      | switchport port-security mac-address [地址] |
| 设置安全访问的最大用户数 | switchport port-security maximum [数目]     |
| 设置端口安全惩罚措施     | switchport port-security violation [措施]   |

## 实验问题