# 02：交换机基本命令

## 实验要求

本次实验主要完成以下几个基本命令的操作:

- 将一台交换机的 hostname 改成nju。

- 将交换机的特权密码设置为 ccna。网管人员连接进入网络设备之后，首先进入的是用户模式，在这个模式下，能使用的命令很少，也无法对网络设备进行配置操作，因此，需要在用户模式下，输入 enable 命令，进入特权模式，在这步操作时，可以设置密码，验证用户身份。增加设备的安全性。

- 将交换机的 vty 线路密码设置为 ccnp。大多数情况下，网络设备并不在网络管理人员可以接触的地方，因此，有时需要远程登陆到网络设备上进行操作，远程登陆使用的是 VTY 线路，因此，对 VTY 线路设置密码，使得网络管理人员在远程登陆网络设备时需要被验证身份。增加设备的安全性。

- 给交换机设置管理 IP 地址和网关。路由器属于三层设备，可以通过接口设置 IP 地址，进行远程登录管理设备。交换机需要通过设置管理 IP 地址，使得网络管理人员通过这个地址远程登录管理交换机。

- 给交换机静态绑定 MAC 地址。交换机在转发数据帧时，通过查找 MAC 地址表进行转发，通过静态绑定 MAC 地址，减少交换机的泛洪的反应时间。

## 实验拓扑

![image-20221008144735876](./chap06_switch_basics.assets/image-20221008144735876.png)

## 实验过程

### 1 将hostname改为nju

```bash
SW1>enable  
SW1#conf t  
Enter configuration commands, one per  line. End with CNTL/Z.  
SW1(config)#hostname nju  
nju(config)#  
```

### 2 设置特权密码和vty线路密码

```bash
nju(config)#enable password ccna
nju(config)#line vty 0 4
nju(config-line)#password ccnp  
```

### 3 设置管理ip地址

```bash
nju(config)#inter vlan1
nju(config-if)#ip add 192.168.1.1 255.255.255.0 
nju(config-if)#no shutdown
nju(config-if)#exit  
nju(config)#ip default-gateway 192.168.1.100  
```

### 4 验证实验

vlan1 默认关闭，需要手动打开，设置了管理ip 地址后，就可以通过远程登录来管理这台IP地址了，将 PC 机的 IP 地址设置为192.168.1.2，然后与交换机的 g1/0/1 相连，`Windows键` + `X键`，选择`Windows Powershell`，`telnet 192.168.1.1`，接着按照下面给出的命令来验证。

![image-20221008145359149](./chap06_switch_basics.assets/image-20221008145359149.png)

telnet 登陆后，分别输入相应的vty 密码和特权密码，即可管理交换机。

## 实验命令列表

| 指令   | 用法                        |
| -------------- | ----------------------------- |
| 进入特权模式   | enable                        |
| 配置主机名     | hostname [hostname]           |
| 设置登陆台密码 | password [password]           |
| 配置IP地址     | ip address [address]          |
| 配置交换机网关 | ip default-gateway  [address] |

## 实验问题

