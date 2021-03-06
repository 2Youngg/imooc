var mongoose=require('mongoose');

var CommentSchema=new mongoose.Schema({
	title:String,	
	commentname:String,
	mark:Number,
	content:String,
	poster:String,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});

CommentSchema.pre('save',function(next){
	if (this.isNew) {
		this.meta.createAt=this.meta.updateAt=Date.now()
	}else{
		this.meta.updateAt=Date.now()
	}
	next()
});

CommentSchema.statics={
	fetch:function(cb){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},
	findById:function(id,cb){
		return this 
			.findOne({
				_id:id
			})
			.exec(cb)
	}
};

module.exports=CommentSchema;