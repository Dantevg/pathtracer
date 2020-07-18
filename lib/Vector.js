class Vector {
	constructor(...items){
		this.items = items
	}
	
	
	
	/* GETTERS, SETTERS */
	get x(){ return this.items[0] }
	get y(){ return this.items[1] }
	get z(){ return this.items[2] }
	set x(v){ this.items[0] = v }
	set y(v){ this.items[1] = v }
	set z(v){ this.items[2] = v }
	
	get r(){ return this.items[0] }
	get g(){ return this.items[1] }
	get b(){ return this.items[2] }
	set r(v){ this.items[0] = v }
	set g(v){ this.items[1] = v }
	set b(v){ this.items[2] = v }
	
	get h(){ return this.items[0] }
	get s(){ return this.items[1] }
	get l(){ return this.items[2] }
	set h(v){ this.items[0] = v }
	set s(v){ this.items[1] = v }
	set l(v){ this.items[2] = v }
	
	get a(){ return this.items[3] }
	set a(v){ this.items[3] = v }
	
	
	
	/* INSTANCE METHODS */
	negative(){
		this.items = this.items.map( val => -val )
		return this
	}
	add(v){
		if( v instanceof Vector ){
			this.items = this.items.map( (val, i) => val+v.items[i] )
		}else{
			this.items = this.items.map( val => val+v )
		}
		return this
	}
	subtract(v){
		if( v instanceof Vector ){
			this.items = this.items.map( (val, i) => val-v.items[i] )
		}else{
			this.items = this.items.map( val => val-v )
		}
		return this
	}
	multiply(v){
		if( v instanceof Vector ){
			this.items = this.items.map( (val, i) => val*v.items[i] )
		}else{
			this.items = this.items.map( val => val*v )
		}
		return this
	}
	divide(v){
		if( v instanceof Vector ){
			this.items = this.items.map( (val, i) => v.items[i] != 0 ? val/v.items[i] : val )
		}else{
			this.items = this.items.map( val => v != 0 ? val/v : val )
		}
		return this
	}
	equals(v){
		if( !(v instanceof Vector) || v.items.length != this.items.length ){
			return false
		}
		return this.items.every( (val, i) => val == v.items[i] )
	}
	dot(v){
		return this.items.map( (val, i) => val*v.items[i] ).reduce( (a,b) => a+b )
	}
	cross2(v){
		return this.x * v.y - this.y * v.x
	}
	cross(v){
		const x = this.y * v.z - this.z * v.y
		const y = this.z * v.x - this.x * v.z
		const z = this.x * v.y - this.y * v.x
		return new Vector( x, y, z )
	}
	length(){
		return Math.sqrt( this.dot(this) )
	}
	normalize(){
		return this.divide( this.length() )
	}
	min(){
		return Math.min( ...this.items )
	}
	max(){
		return Math.max( ...this.items )
	}
	toAngles(){
		return -Math.atan2( -this.y, this.x )
	}
	getTheta(){
		return Math.acos( this.z / this.length() )
	}
	getPhi(){
		return Math.atan2( this.y, this.x )
	}
	angleTo(a){
		return Math.acos( this.dot(a) / (this.length() * a.length()) )
	}
	toArray(n){
		return this.items
	}
	clone(){
		return new Vector( ...this.items )
	}
	set( ...values ){
		[...this.items] = values
		return this
	}
	rotate(angle){
		const [sin, cos] = [Math.sin(angle), Math.cos(angle)];
		[this.x, this.y] = [this.x*cos - this.y*sin, this.x*sin + this.y*cos]
		return this
	}
	rotateX(angle){
		const [sin, cos] = [Math.sin(angle), Math.cos(angle)];
		[this.x, this.y, this.z] = [this.x*cos - this.y*sin, this.x*sin + this.y*cos, this.z]
		return this
	}
	rotateY(angle){
		const [sin, cos] = [Math.sin(angle), Math.cos(angle)];
		[this.x, this.y, this.z] = [this.x*cos + this.z*sin, this.y, -this.x*sin + this.z*cos]
		return this
	}
	rotateZ(angle){
		const [sin, cos] = [Math.sin(angle), Math.cos(angle)];
		[this.x, this.y, this.z] = [this.x, this.y*cos - this.z*sin, this.y*sin + this.z*cos]
		return this
	}
	average(){
		return this.items.reduce( (a,b) => a+b ) / this.items.length
	}
	toString(){
		return "[" + this.items.toString() + "]"
	}
	
	
	
	/* STATIC METHODS */
	static negative(v){
		return new this( ...v.items.map( val => -val ) )
	}
	static add( a, b ){
		if( b instanceof Vector ){
			return new this( ...a.items.map( (val, i) => val + b.items[i] ) )
		}else{
			return new this( ...a.items.map( val => val + b ) )
		}
	}
	static subtract( a, b ){
		if( b instanceof Vector ){
			return new this( ...a.items.map( (val, i) => val - b.items[i] ) )
		}else{
			return new this( ...a.items.map( val => val - b ) )
		}
	}
	static multiply( a, b ){
		if( b instanceof Vector ){
			return new this( ...a.items.map( (val, i) => val * b.items[i] ) )
		}else{
			return new this( ...a.items.map( val => val * b ) )
		}
	}
	static divide( a, b ){
		if( b instanceof Vector ){
			return new this( ...a.items.map( (val, i) => val / b.items[i] ) )
		}else{
			return new this( ...a.items.map( val => val / b ) )
		}
	}
	static equals( a, b ){
		if( !(a instanceof Vector) || !(b instanceof Vector) || a.items.length != b.items.length ){
			return false
		}
		return a.items.every( (val, i) => val == b.items[i] )
	}
	static dot( a, b ){
		return a.items.map( (val, i) => val*b.items[i] ).reduce( (a,b) => a+b )
	}
	static cross2( a, b ){
		return a.x * b.y - a.y * b.x
	}
	static cross( a, b ){
		const x = a.y*b.z - a.z*b.y
		const y = a.z*b.x - a.x*b.z
		const z = a.x*b.y - a.y*b.x
		return new Vector( x, y, z )
	}
	static normalize(v){
		return this.divide( v, v.length() )
	}
	static distSq( a, b ){
		return a.items.map( (val, i) => (val-b.items[i])**2 ).reduce( (a,b) => a+b )
	}
	static dist( a, b ){
		return Math.sqrt( this.distSq(a, b) )
	}
	static clone(v){
		return new this( ...v.items )
	}
	static rotate( v, angle ){
		const x = v.x * Math.cos(angle) - v.y * Math.sin(angle)
		const y = v.x * Math.sin(angle) + v.y * Math.cos(angle)
		return new this( x, y )
	}
	static rotateX( v, angle ){
		const x = v.x * Math.cos(angle) - v.y * Math.sin(angle)
		const y = v.x * Math.sin(angle) + v.y * Math.cos(angle)
		const z = v.z
		return new this( x, y, z )
	}
	static rotateY( v, angle ){
		const x = v.x * Math.cos(angle) + v.z * Math.sin(angle)
		const y = v.y
		const z = -v.x * Math.sin(angle) + v.z * Math.cos(angle)
		return new this( x, y, z )
	}
	static rotateZ( v, angle ){
		const x = v.x
		const y = v.y * Math.cos(angle) - v.z * Math.sin(angle)
		const z = v.y * Math.sin(angle) + v.z * Math.cos(angle)
		return new this( x, y, z )
	}
	static average(v){
		return v.items.reduce( (a,b) => a+b ) / v.items.length
	}
	static fromAngle(angle){
		return new this( Math.cos(angle), Math.sin(angle) )
	}
	static fromAngles3D( theta, phi ){
		const x = Math.sin(theta) * Math.cos(phi)
		const y = Math.sin(theta) * Math.sin(phi)
		const z = Math.cos(theta)
		return new this( x, y, z )
	}
	static random(n){
		return new this( ...Array.from({length: n ?? 2}, () => Math.random()) )
	}
	static random2DAngle(){
		return this.fromAngle( Math.random()*Math.PI*2 )
	}
	static random3DAngles(){
		return this.fromAngles3D( Math.acos( 1 - 2*Math.random() ), Math.random()*Math.PI*2 )
	}
	
}