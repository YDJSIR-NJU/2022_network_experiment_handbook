# 14：DHCP欺诈保护

## 实验前准备

​    DHCP的主要作用是给网络中的其他设备动态分配IP地址，从而节约IP资源。

​    DHCP欺骗：攻击者可以通过伪造大量的IP请求包，消耗掉现有DHCP服务器的IP资源。当有计算机请求IP时，DHCP服务器就无法分配IP。此时，攻击者可以伪造一个DHCP服务器为计算机分配IP，并指定一个虚假的DNS服务器地址。这时，当用户访问网站的时候，就被虚假DNS服务器引导到错误的网站。

​    在交换机上开启DHCP snooping功能，绑定并过滤不信任的DHCP信息可以防止DHCP欺骗。对于信任端口收到的DHCP服务器报文，交换机不会丢弃而直接转发，来自非信任端口的DHCP报文则无法通过，从而有效的防止了DHCP欺骗。

## 实验要求

本次实验要求在路由器上启用DHCP服务为两台计算机动态分配IP。此外，还需配置交换机的DHCP snooping功能防止DHCP欺骗。

## 实验拓扑



## 实验过程

### 1 配置路由器Router1的DHCP功能。

```bash
Router1(config)#service dhcp
Router1(config)#ip dhcp pool nju1
Router1(dhcp-config)#network 10.1.1.0 255.255.255.0
Router1(dhcp-config)#default-router 10.1.1.1
Router1(dhcp-config)#dns-server 10.1.1.1
Router1(config)#ip dhcp excluded-address 10.1.1.1 10.1.1.10
```

### 2 设置计算机ip获取为DHCP

​    检查计算机IP并在Router1上查看地址分配，如图16.2所示。

```bash
Router#show ip dhcp binding
IP address        Client-ID/            Lease expiration   Type
                Hardware address
10.1.1.21         00E0.A3A5.4929      - -              Automatic
10.1.1.22         00D0.BAD4.D490      - -              Automatic
```

 

### 3 防止DHCP欺骗

按照步骤1配置Router0，将Router0的DHCP地址池设置为20.1.1.0

配置交换机snooping功能，将与Router1相连的f0/2端口设置为信任端口

```bash
Switch(config)#ip dhcp snooping
Switch(config)#ip dhcp snooping vlan 1
Switch(config)#int f0/2
Switch(config-if)#ip dhcp snooping trust
```

 

配置路由器Router1

```bash
Router1(config)#ip dhcp relay information trust-all
```

```bash
Switch#show ip dhcp snooping 
Switch DHCP snooping is enabled
DHCP snooping is configured on following VLANs:
1
Insertion of option 82 is enabled
Option 82 on untrusted port is not allowed
Verification of hwaddr field is enabled
Interface Trusted Rate limit (pps)
----------------------- ------- ----------------
FastEthernet0/1 no unlimited 
FastEthernet0/2 yes unlimited 
FastEthernet0/3 no unlimited 
FastEthernet0/4 no unlimited
```

​    此时，两台计算机IP地址均由Router1分配，IP地址如图16.4和16.5所示。

```bash
C:\>ipconfig

FastEthernet0 Connection:(default port)

   Link-local IPv6 Address.........: FE80::2D0:BAFF:FED4:D490
   IP Address......................: 10.1.1.22
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: 10.1.1.1
```
```bash
C:\>ipconfig

FastEthernet0 Connection:(default port)

   Link-local IPv6 Address.........: FE80::2E0:A3FF:FEA5:4929
   IP Address......................: 10.1.1.21
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: 10.1.1.1
```

将交换机f0/1设置为信任端口，f0/2设置为非信任端口。

```bash
Switch(config)#int f0/2
Switch(config-if)#no ip dhcp sn
Switch(config-if)#no ip dhcp snooping trust
Switch(config)#int f0/1
Switch(config-if)#ip dhcp snooping trust
Switch(config-if)#end
```

再次检查两台计算机的IP地址，如图16.6和16.7所示。

```bash
C:\>ipconfig

FastEthernet0 Connection:(default port)

   Link-local IPv6 Address.........: FE80::2E0:A3FF:FEA5:4929
   IP Address......................: 20.1.1.17
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: 20.1.1.1
```

```bash
C:\>ipconfig

FastEthernet0 Connection:(default port)

   Link-local IPv6 Address.........: FE80::2D0:BAFF:FED4:D490
   IP Address......................: 20.1.1.18
   Subnet Mask.....................: 255.255.255.0
   Default Gateway.................: 20.1.1.1
```

可以看到，通过交换机snooping的配置，能够阻止非信任端口的DHCP报文传输，从而避免DHCP欺骗。

 

## 实验命令列表

| 打开dhcp功能                                             | service dhcp                                   |
| -------------------------------------------------------- | ---------------------------------------------- |
| 配置dhcp地址池名称                                       | dhcp dhcp pool [pool name]                     |
| 配置要分配的网段                                         | network [address] netmask                      |
| 配置默认网关                                             | default-router [address]                       |
| 配置dns服务器                                            | dns-server [address]                           |
| 配置不分配地址                                           | ip dhcp excluded-address [address1] [address2] |
| 打开dhcp snooping功能                                    | ip dhcp snooping                               |
| 设置作用的vlan                                           | ip dhcp snooping vlan *n*                      |
| 配置信任端口                                             | ip dhcp snooping trust                         |
| 配置dhcp中继代理的所有接口都作为dhcp中继信息选项的信任源 | ip dhcp relay information trust-all            |

## 实验问题