import { defineStore } from 'pinia'

export const useMenuStore = defineStore('MenuStore', {
  // arrow function recommended for full type inference
    state: () => {
        return {
            // all these properties will have their type inferred automatically
            menu: [
                { label: 'Home',      path: '/',          active: true  },
                { label: 'About',     path: '/about',     active: false },
                { label: 'Services',  path: '/services',  active: false },
                { label: 'Portfolio', path: '/portfolio', active: false },
                { label: 'Blog',      path: '/blog',      active: false },
                { label: 'Contact',   path: '/contact',   active: false },
            ] as Array<{label: string, path: string, active: boolean}>,
            menuMode:false
        }
    },
    actions: {
        // since we rely on `this`, we cannot use an arrow function
        isActive(routePath: string){ 
            this.menu.map((item) => {  
                item.active = false              
                if(item.path === routePath){
                    item.active = true
                }                
                return item
            })
        },
        loadPage(path: string){
            const router = useRouter()
            router.push(path)            
        },
        toggleMenu(path: string){
            this.menuMode = !this.menuMode            
        }
    },
})