# 07：动态RIP

[点此下载本次实验的 Cisco Packet Tracer 文件](./chap09.pkt)

## 实验要求

本次实验主要完成以下操作

在路由器上，通过使用动态RIP路由协议将三台路由器组成一个小网络

## 实验拓扑

![image-20221018192457207](./chap09_router_rip.assets/image-20221018192457207.png)

## 实验过程

1. **按照网络拓扑图配置各端口 ip， 并启动端口。**

2. **检查连通性**

   使用 `show ip route` 指令查看现在的路由表。

   在路由器 A 上尝试 ping `192.168.10.2` `192.168.20.2` `192.168.20.1`，能否连通？为什么？

3. **配置 RIP 协议动态路由**

   ```bash
   RouterA(config)#router rip
   RouterA(config-router)#network 192.168.10.0
   
   RouterB(config)#router rip
   RouterB(config-router)#network 192.168.10.0
   RouterB(config-router)#network 192.168.20.0
   
   RouterC(config)#router rip
   RouterC(config-router)#network 192.168.20.0
   ```

4. **再次检查连通性**

   使用 `show ip route` 指令查看现在的路由表，有何不同？

   在路由器 A 上尝试 ping  `192.168.20.1`，连通则实验成功。

   ```bash
   RouterA#ping 192.168.20.1
   Type escape sequence to abort.
   Sending 5, 100-byte ICMP Echos to 192.168.20.1, timeout is 2 seconds:
   !!!!!
   Success rate is 100 percent (5/5), round-trip min/avg/max = 22/36/44 ms
   ```

注：使用如下指令可以查看路由表更新(每30秒更新一次)

```bash
debug ip rip #开始查看
no debug all #停止查看
```

## 实验命令列表

| 指令 | 用法 |
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