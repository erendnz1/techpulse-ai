warning: in the working copy of 'frontend/next.config.ts', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/frontend/next.config.ts b/frontend/next.config.ts[m
[1mindex e9ffa30..04dfc1a 100644[m
[1m--- a/frontend/next.config.ts[m
[1m+++ b/frontend/next.config.ts[m
[36m@@ -1,7 +1,14 @@[m
 import type { NextConfig } from "next";[m
 [m
 const nextConfig: NextConfig = {[m
[31m-  /* config options here */[m
[32m+[m[32m  images: {[m
[32m+[m[32m    remotePatterns: [[m
[32m+[m[32m      {[m
[32m+[m[32m        protocol: "https",[m
[32m+[m[32m        hostname: "**",[m
[32m+[m[32m      },[m
[32m+[m[32m    ],[m
[32m+[m[32m  },[m
 };[m
 [m
[31m-export default nextConfig;[m
[32m+[m[32mexport default nextConfig;[m
\ No newline at end of file[m
