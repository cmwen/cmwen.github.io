---
title: "Beyond Bluetooth: What Can We Actually Build with BLE?"
description: "Exploring AirTag, indoor positioning, AirDrop, and proximity-based apps through BLE's protocol and application layers."
author: "Min Wen"
pubDatetime: 2026-11-08T20:45:28.557Z
lang: "en"
draft: false
tags: ["Bluetooth","BLE","Software Engineering","IoT","Android"]
baseSlug: "beyond-bluetooth-what-can-we-build-with-ble"
---

*From AirTag and indoor positioning to peer-to-peer discovery — exploring the application possibilities of Bluetooth Low Energy.*

In my previous exploration of Bluetooth Low Energy (BLE), I learned about Broadcasters, Observers, GATT, and HID. What surprised me was how much functionality we can build without installing custom drivers or implementing low-level communication protocols.

That led me to another question:

**If BLE makes it so easy for devices to discover and communicate with each other, what can we actually build on top of it?**

I started looking at AirTag, indoor positioning, AirDrop, and even how BLE might help my own WebRTC multiplayer game.

What I found interesting wasn't just the technology itself, but how different applications combine the same underlying capabilities.

## 1. AirTag: A Tiny Device Powered by a Global Network

Apple AirTag is a fascinating example of how much can be achieved with very little hardware.

An AirTag doesn't need GPS, cellular connectivity, or a permanent internet connection.

Instead, it periodically broadcasts BLE signals containing rotating cryptographic identifiers.

Nearby participating Apple devices can detect these signals and securely report encrypted location information through Apple's Find My network.

The owner can then locate the AirTag, even if it's thousands of kilometres away.

The architecture is surprisingly simple at a conceptual level:

- **BLE:** Discover nearby tags.
- **Nearby phones:** Act as observers and internet gateways.
- **Find My network:** Securely collect and retrieve location reports.
- **UWB:** Provide precise distance and direction when the owner gets close enough.

The important distinction is that UWB isn't responsible for finding an AirTag across the world. The distributed network of nearby phones makes that possible.

And the network is not simply an open collection of BLE scanners. Apple and Google operate separate finding networks, with their own protocols, privacy protections and accessory requirements.

**My takeaway:** A device doesn't always need its own internet connection. It can leverage nearby devices as gateways, provided the application ecosystem supports it.

## 2. Indoor Positioning: BLE as a Location Signal

Another interesting application is indoor positioning.

GPS works well outdoors, but inside shopping malls, airports, offices, or warehouses, its accuracy and availability become limited.

BLE Beacons offer a different approach.

Imagine placing several small BLE transmitters around a building. Each broadcasts an identifier that corresponds to a known location.

A phone scans these signals and estimates where it is.

At the simplest level, the application can determine which beacon is nearby.

With multiple beacons, signal-strength measurements and a calibrated positioning model, it can estimate a location within the building.

But BLE signal strength is affected by walls, people, reflections and device orientation. It doesn't automatically provide precise coordinates.

For more accurate positioning, technologies such as UWB can measure distances using radio signal flight time. Bluetooth Channel Sounding offers another approach to more accurate ranging on supported hardware.

The important insight is that **BLE itself doesn't know where a beacon is located.**

The application needs a map or database that associates beacon identifiers with physical locations.

This creates a useful separation:

- BLE provides observations.
- A positioning engine estimates location.
- An application interprets that location.

The same architecture could support indoor navigation, asset tracking, room-based automation or context-aware applications.

## 3. AirDrop: Discovery and Data Transfer Are Different Problems

AirDrop demonstrates another useful design pattern.

Bluetooth is excellent for discovering nearby devices, but it's not necessarily the best transport for transferring large files.

AirDrop combines nearby discovery using BLE with high-speed peer-to-peer Wi-Fi communication.

This separates two concerns:

**Discovery:** Who is nearby, and what services are available?

**Transport:** How should we actually exchange data?

The same idea applies to other applications.

For example, a multiplayer game could use BLE to discover nearby players and exchange connection information, then use WebRTC over an available IP network for gameplay.

BLE doesn't create that IP network by itself, but it could eliminate the need for a central discovery service in a native application.

For a browser-based PWA, however, things are more restricted. Web Bluetooth primarily exposes GATT client capabilities, and browsers don't generally provide arbitrary BLE advertising or UDP broadcast APIs.

So the architecture is possible, but platform capabilities matter.

## 4. BLE as an Application Building Block

After exploring these examples, I started seeing BLE differently.

It's not just a replacement for a serial cable or a way to connect headphones and keyboards.

It provides reusable capabilities that applications can combine in different ways.

| BLE capability | Application possibilities |
| --- | --- |
| Advertising | Nearby device and service discovery |
| Scanning | Proximity awareness and environmental observation |
| GATT | Configuration, commands and sensor data |
| HID over GATT | Keyboards, mice, game controllers |
| Periodic advertising | Scheduled broadcast data distribution |
| BLE + Internet gateway | Asset tracking and distributed sensing |
| BLE + UWB | Precise ranging and proximity interactions |
| BLE + Wi-Fi/WebRTC | Discovery followed by higher-bandwidth communication |

Some applications don't even need to establish a connection.

A beacon can broadcast a small amount of information, and nearby observers can decide what to do with it.

Others require a connection, authentication and application-specific protocols.

The choice depends on what we're trying to build.

## 5. Protocol Layer vs Application Layer

This is probably the most useful distinction I learned.

BLE gives us communication mechanisms, but it doesn't automatically define the application.

Consider these layers:

```text
Application Layer
  AirTag / Indoor Navigation / Game Discovery
  Smart Home / Context-Aware Automation
                  |
Application Protocol
  Identity / Authentication / Messages
  Service Semantics / Privacy
                  |
BLE Services & Profiles
  GATT / GAP / HID / Custom Services
                  |
Bluetooth Link & Radio
  Advertising / Scanning / Connections
  Channels / Timing / Encryption
```

For example:

**AirTag**

BLE provides wireless discovery. The Find My application protocol adds rotating identities, encrypted location reports, ownership and network participation.

**Indoor positioning**

BLE provides beacon observations. The application adds a floor plan, beacon locations and positioning algorithms.

**Game discovery**

BLE could advertise an available game session. The application defines session identity, joining, authentication and WebRTC signaling.

The same radio technology supports very different products because the application protocols define what those signals mean.

This reminds me of REST APIs.

HTTP provides a standard communication mechanism, but the application defines its resources, authentication and business logic.

Similarly, BLE provides standard ways to discover and communicate with devices. We don't need to reinvent the radio stack to build a new application.

Of course, BLE is more constrained than HTTP. Payload sizes, power consumption, timing, background execution and operating-system permissions all affect the design.

## 6. What Would I Like to Build?

A few ideas now seem much more achievable.

**Context-aware launcher**

An Android launcher could discover BLE beacons placed near a desk, car or living room, then adapt its app shortcuts and widgets to the current context.

The challenge would be reliable context detection, avoiding false triggers and dealing with Android background restrictions.

**ESP32 event gateway**

An ESP32 could collect information from sensors or network services, then advertise compact status updates over BLE.

Nearby devices could discover the gateway and connect through GATT when they need more information.

**Nearby multiplayer discovery**

A native companion could advertise game sessions over BLE and exchange WebRTC signaling information.

The actual gameplay would continue over Wi-Fi or another IP connection.

**Personal indoor positioning**

A few strategically placed beacons could provide room-level context. UWB could be introduced later if precise ranging becomes necessary.

These ideas don't necessarily require complex hardware. Much of the interesting work is in the application protocol and how we interpret the signals.

## 7. The Bigger Lesson

What excites me most is how mature standards and modern development tools lower the barrier to building hardware-connected applications.

Previously, working with wireless devices often felt like something that required deep embedded-system expertise.

Now, with an ESP32, Android APIs, existing Bluetooth stacks and AI-assisted development, it's much easier to experiment.

But there's an important difference between making a prototype work and building a reliable system.

Discovery timing, rotating identities, authentication, privacy, battery life and platform restrictions still matter.

**The opportunity isn't to reinvent Bluetooth. It's to build useful applications on top of the capabilities Bluetooth already provides.**

And perhaps that's the bigger shift in how I think about software development: instead of starting with an application and asking what hardware it needs, I can start with a capability like proximity discovery and explore what new experiences it makes possible.
