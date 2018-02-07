// Tibby.JS - A Navigation Tab plugin which allows you to have multiple
//           nabs ( navs + tabs, get it? :D ) on a page..
//           Tibby excels in setting history when navigation across multiple
//           nabs and allowing you to set your own URLs.

import { hasClass, addClass, removeClass, findParent } from '../helpers/dom-helper';

export default class Tibby {
  options: any = {};
  
  currentWindowHash: any = {};

  constructor(customOptions: any = {}) {
    this.options = {
      tabsDefaultItem:      'data-hashtabber-default' || customOptions.tabsDefaultItem,
      tabsID:               'data-tabs-id'            || customOptions.tabsID,
      tabsActiveClass:      '.active'                 || customOptions.tabsActiveClass,
      
      tabsNavContainer:     '[data-tabs]'             || customOptions.tabsNavContainer,
      tabsNavItem:          '[data-tabs-item]'        || customOptions.tabsNavItem,
      tabsNavURL:           '[data-tab]'              || customOptions.tabsNavURL,
      
      tabsContentContainer: '[data-tabs-content]'     || customOptions.tabsContentContainer,
      tabsContentItem:      '[data-tabs-pane]'        || customOptions.tabsContentItem
    }

    this.checkCurrentLocationHash(this.options);
    this.run();
  }

  public run() {
    const a: any = document.querySelectorAll(this.options.tabsNavURL);

    a.forEach((tabTrigger) => {
      tabTrigger.addEventListener('click', (event) => {
        event.preventDefault();
                
        this.setTab(tabTrigger)
      })
    })
    
    let that = this;

    window.onhashchange = function () {
      that.checkCurrentLocationHash(that.options);
    };

    return true;
  }
  
  checkCurrentLocationHash(options: any) {
    let navigationTabs: any = document.querySelectorAll(options.tabsNavContainer);
    const xx = {};

    if (window.location.hash != '') {   
      let bb = window.location.hash
        .replace('#', '')
        .split(',')

      bb.forEach((yy) => {
        let zz = yy.split('=');

        xx[zz[0]] = {
          tab: zz[0],
          item: zz[1]
        }
      })
    }

    navigationTabs.forEach((tabs: any) => {
      const activeTabNavigation: string = tabs.dataset.tabsId;
      const activeTabNavigationItem: string = tabs
        .querySelector(`${ options.tabsNavItem }${ options.tabsActiveClass }`)
        .querySelector(options.tabsNavURL).hash.replace('#', '');

      this.currentWindowHash[activeTabNavigation] = {}
      this.currentWindowHash[activeTabNavigation]['tab'] = activeTabNavigation;
      this.currentWindowHash[activeTabNavigation]['item'] = activeTabNavigationItem;
      
      if (window.location.hash == '') {
        this.setTab(document.querySelector(`a[href='#${ activeTabNavigationItem }']`))
      } else {
        this.setTab(document.querySelector(`a[href='#${ xx[activeTabNavigation]['item'] }']`))
      }
    });
    
    this.setWindowLocationHash();
  }

  setWindowLocationHash() {
    const encodedHash = [];
    
    let o: any = Object;

    o.values(this.currentWindowHash).forEach((key) => {
      encodedHash.push(`${ key['tab'] }=${ key['item']}`)
    })

    return window.location.hash = String(encodedHash);
  }

  setTab(selectedTab) {
    const selectedTabParentTabItem = findParent(selectedTab, '.tab-item'),
          selectedTabParentTabs = findParent(selectedTab, '.tabs');

    this.currentWindowHash[selectedTabParentTabs.dataset.tabsId]['item'] = selectedTab.hash.replace('#', '')

    const selectedTabParentTabsChildren = selectedTabParentTabs
      .querySelectorAll(this.options.tabsNavItem);

    addClass(selectedTabParentTabs, 'active');

    selectedTabParentTabsChildren.forEach((children) => {
      if (selectedTabParentTabItem == children) {
        addClass(selectedTab, 'active')
        addClass(children, 'active')

        let c: any = document
          .querySelector(`[data-tabs-content][data-tabs-id='${ selectedTabParentTabs.dataset.tabsId }']`)
          .querySelectorAll(this.options.tabsContentItem);
        
        c.forEach((ee) => {
          if (ee == document.getElementById(selectedTab.hash.replace('#', ''))) {
            addClass(document.getElementById(selectedTab.hash.replace('#', '')), 'active')
          } else {
            removeClass(ee, 'active')
          }
        })
      } else {
        removeClass(selectedTab, 'active')
        removeClass(children, 'active')
      }
    })

    this.setWindowLocationHash();
  }
}
