//存取localStorage中的数据
var store = {
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value))
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}
/*
	{
		title:"士大夫士大夫",
		isChecked:false
	},
	{
		title:"沙发士大夫",
		isChecked:true
	}
];
*/

var list = store.fetch("miaov-class");
if(list.length==0){
	$('.no-task-tip').show();
}
var vm = new Vue({
	el:".main",
	data:{
		list:list,
		todo:"",
		//记录正在编辑的数据
		edtorTodos:''  ,
		beforeTitle:'',
		//通过这个属性值的变化对数据进行筛选
		visibility:"all"
	},
	//监控list这个属性，当这个属性对应的值发生变化时执行函数
	watch:{
		list:{
			handler:function(){
				store.save("miaov-class",this.list);
			},
			deep:true
		}
	},
	computed:{
		nochecklength:function(){
			return this.list.filter(function(item){
			    return !item.isChecked
			}).length
		},
		filteredList:function(){
			var filter = {
				all:function(list){
					return list;
				},
				finished:function(list){
					return list.filter(function(item){
						return item.isChecked;
					});
				},
				unfinished:function(list){
					return list.filter(function(item){
						return !item.isChecked;
					});
				}
			}
			
			return filter[this.visibility] ? filter[this.visibility](list) : list;
		}
		
	},
	methods:{
		//添加任务
		addTodo(ev){
			//事件处理函数中的this指向的是当前这个根实例
			this.list.push({
				title:this.todo,
				isChecked:false
			});
			
			this.todo = '';
		},
		//删除任务
		deleteTodo(todo){
			var index = this.list.indexOf(todo);
			this.list.splice(index,1);
		},
		//编辑任务
		edtorTodo(todo){
			this.edtorTodos = todo;
			this.beforeTitle = todo.title;
		},
		//编辑完成
		edtorTodoed(todo){
			this.edtorTodos = '';
		},
		//取消编辑
		cancelTodo(todo){
			todo.title = this.beforeTitle;
			this.edtorTodos = '';
		}
	},
	directives:{
		"focus":{
			update(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	}
});

function watchHashChange(){
	var hash = window.location.hash.slice(1);
	
	vm.visibility = hash;
}

watchHashChange();

window.addEventListener("hashchange",watchHashChange);
