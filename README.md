# React Native Mobile-SDK install
##NPM install
npm install cmsframeworkmodule    
##Android Studio project  Setup
a) copy framework.aar to 'libs' folder    
b) set 'MinSDKversion' as 18 in Grandle    
c) add repositories in Grandle as following:    
      repositories{    
	      flatDir{    
	      	dirs 'libs'    
	      }    
      }     
  d) add compile (name:'framework',ext:'aar')    
  e) add compile 'net.zetetic:android-database-sqlcipher:3.5.6@aar'    
##iOS project Setup
a)add CMSFrameworkModule class into iOS prjoejct    
b)copy public.pem into project    
c)copy call1.framework into project    
d)add "Supported external accessory protocols" group into info.plist file    
e) add "com.miura.shuttle" in the group    
f) add "com.detects.pinpad" in the groupd    
g) add "com.castles.protocolCastles" in the group.    
h) add Copy File section in Build Phrase of the project    
i) add call1.framework as "Framework" in the section    
l) chose "Code sign on Copy"    
## Use Mobile SDK in React-Native
a) add import CMSFramework from "cmsframeworkmodule"  in your .js file    
b) add NativeEventEmitter listener. the event name is "CMSEVENT"    


