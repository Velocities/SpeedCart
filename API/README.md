## Development Setup on Windows with WSL2 for Blazing Fast Laravel Docker Performance

### Why This Setup?

By default, mounting your Laravel project from the Windows filesystem (`C:\...`) into Docker containers on Windows causes **extremely slow file I/O**, leading to very long request times (up to several seconds per request). This is due to the way Windows handles filesystem mounts and is a common pain point.

To fix this, we move the project files into the **native Linux filesystem inside WSL2** and run Docker from there, resulting in massive performance improvements (down to milliseconds per request).

---

### Step-by-step Setup Instructions

### VSCode extension install
For simplicity, you should develop with VSCode with the WSL extension installed
so you can easily develop this Laravel app after getting the Ubuntu WSL setup steps done
as part of step 1. This extension will come in handy by step 2.
This is the WSL extension: https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl

#### 1. Start your WSL2 Ubuntu distro

Open PowerShell or Windows Terminal and run:

```bash
wsl -d Ubuntu
```

### 2. Create a projects folder and copy the repo into WSL

Inside the WSL terminal:

```bash
mkdir -p ~/projects
cp -r yourmounteddirectory/API ~/projects/SpeedCart
cd ~/projects/SpeedCart/API
```
Replace `yourmounteddirectory` with the directory that WSL goes to in vscode after you finish the startup
from step 1. You can see that you only need to copy the API folder into the container because this is just
for the Laravel app.
(should look something like `/mnt/c/Users/Admin/Desktop/Repos/SpeedCart` or similar depending on where
you store this repo)

### 3. Open the project in VSCode with WSL integration

Run:
```bash
code .
```
This will open the project in VSCode connected directly to WSL.

### 4. Enable Docker integration for your Ubuntu WSL distro
Open Docker Desktop on Windows.

Go to Settings > Resources > WSL Integration.

Enable the toggle for your Ubuntu distro.

Click Apply & Restart if prompted.

### 5. Verify Docker inside WSL
Back in your Ubuntu terminal, test Docker:

```bash
docker --version
docker compose version
```
You should see version info confirming Docker works inside WSL.

### 6. Run your Laravel containers
Inside the WSL terminal in your project folder:

```bash
cd docker/development
docker compose up -d --build
```

While still in the WSL terminal, be sure to run migrations to build the database tables:
```bash
docker exec -it laravel_dev sh
php artisan migrate
```

Enjoy lightning-fast performance thanks to native Linux filesystem speeds inside WSL.

## Git workflow
Since your code lives inside WSL's Linux filesystem, you can use Git as usual inside WSL:

## Optional: Running Composer & Node inside WSL
For best performance, install Composer and Node directly in your WSL Ubuntu environment to run commands like composer install and npm install super fast without Windows filesystem overhead.