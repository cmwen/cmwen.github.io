---
title: "Continuous E-book Reading Across Devices with KOReader and Syncthing"
description: "A guide to setting up a fully offline, self-hosted solution for synchronizing e-book progress, notes, and highlights across multiple devices using KOReader and Syncthing."
pubDatetime: 2025-09-20
modDatetime: 2025-09-20
postSlug: "koreader-syncthing-ebook-sync"
tags: ["ebook", "koreader", "syncthing", "self-hosted", "privacy"]
featured: false
draft: false
author: "Jules"
lang: "en"
baseSlug: "koreader-syncthing-ebook-sync"
llmKeyIdeas:
  - "Self-hosted e-book sync"
  - "KOReader for reading"
  - "Syncthing for synchronization"
  - "Offline-first and private"
  - "Cross-device progress syncing"
  - "DRM-free e-books required"
---

## The Quest for a Perfect E-book Sync Solution

I've been on a journey to find the ideal e-book reading setup for a while. Many commercial solutions lock you into their ecosystem, and you never truly own your data. I wanted something different: a fully offline, self-hosted system that gives me complete control over my e-books and reading data. After some experimentation, I've settled on a powerful combination: **KOReader** and **Syncthing**.

This setup allows you to seamlessly sync your books, reading progress, notes, and highlights across all your devices without relying on a central server you don't control.

## Why KOReader and Syncthing?

- **KOReader**: A versatile, open-source document and image viewer for E Ink devices. It supports a wide range of formats and is highly customizable. Crucially, it saves reading progress and notes in plain text files, which is perfect for syncing.
- **Syncthing**: A free, open-source, and peer-to-peer file synchronization application. It allows you to sync files between devices on a local network or over the internet, securely and privately.

## The Setup

The core idea is to have a shared folder that Syncthing keeps in sync across your devices. KOReader on each device will then use this folder to store its data.

### My Setup: Laptop as a "Main Server"

I use my laptop as a central hub for my e-books. This isn't strictly necessary, but it gives me a single place to manage my library and see the status of all my synced devices.

### Setting up Syncthing on Android

On Android, you have a couple of options for Syncthing clients:

- **Syncthing-fork**: This is the one I recommend. It has a user-friendly interface and can discover other Syncthing devices on your local network automatically. This makes setup a breeze.
- **Syncthing-Lite**: A lighter client, but it has a significant drawback. If your device doesn't have a camera, you'll need to manually type in the long and complex device ID to connect to other devices, which is prone to errors.

### A Note on DRM

This solution only works for DRM-free e-books. If your e-books have Digital Rights Management (DRM), you will need to find a way to remove it before you can use them with this setup.

## The Result: Seamless Syncing

With KOReader and Syncthing working together, you get:

- **Book Synchronization**: Add an e-book to your synced folder on one device, and it appears on all others.
- **Progress Syncing**: Read a few chapters on your e-reader, and when you open the book on your phone, you'll be right where you left off.
- **Notes and Highlights Syncing**: Any notes or highlights you make are also synced across all devices.

## The Only Drawback

The biggest limitation of this setup is the lack of a native KOReader application for macOS. While there are workarounds, it's not as seamless as on other platforms.

## Conclusion

If you're looking for a private, offline-first, and highly customizable e-book syncing solution that you control, the combination of KOReader and Syncthing is hard to beat. It takes a little bit of setup, but the result is a truly continuous reading experience that puts you back in control of your data.
