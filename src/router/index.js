import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/index.vue'
import UserAgreement from '@/views/agreement/useragreement/index.vue'
import PrivacyPolicy from '@/views/agreement/privacypolicy/index.vue'
import Agreement from '@/views/agreement/index.vue'
import Tipping from '@/views/tipping/index.vue' 
import Errorpages from '@/views/user/No-parameters.vue'
import User from '@/views/user/index.vue'
import Control from '@/views/control/index.vue'
import Essay from '@/views/essay/index.vue'
import Dev from '@/views/essay/all/dev.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/agreement/useragreement', name: 'UserAgreement', component: UserAgreement },
  { path: '/agreement/privacypolicy', name: 'PrivacyPolicy', component: PrivacyPolicy },
  { path: '/agreement', name: 'Agreement', component: Agreement },
  { path: '/tipping', name: 'Tipping', component: Tipping },
  { path: '/user/:id', name: 'User', component: User },
  { path: '/user', name: 'UserError', component: Errorpages },
  { path: '/control/:id', name: 'Control', component: Control },
  { path: '/control', name: 'ControlError', component: Errorpages },
  { path: '/essay' ,name: 'Essay' ,component: Essay},
  { path: '/essay/all:id',name:'DevEssay',component:Dev},
  { path: '/essay/all', name:'ErrorEssay',component:Errorpages},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
