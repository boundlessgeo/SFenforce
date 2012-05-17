Ext.define('SFenforce.store.Pco',{
   extend: 'Ext.data.JsonStore',
   requires: ['Ext.data.proxy.LocalStorage'],
   config: {
       model: 'SFenforce.model.Pco',
       proxy: {
           type: 'localstorage',
           id: 'sfenforce-pco'
       },
       autoSync: true,
       autoLoad: true
   } 
});
