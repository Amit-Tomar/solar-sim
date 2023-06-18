import GUI from 'lil-gui';
import gsap from "gsap";
import {dateToString, stringTodate} from './utils';

class ControlPanel
{
	constructor(sun,onChange)
	{
		this.gui = new GUI();
		this.sun = sun;

		this.config = {
			latitude: 28.9845,
			longitude: 77.7064,
			animate: false,
			date: "",
			dateObject: {},
			animationTime: 0
		}

		this.gui.add(this.config, 'latitude').name('Lat').onChange(()=>{
			this.sun.resetPathDraw()
		});
		this.gui.add(this.config, 'longitude').name('Lng').onChange(()=>{
			this.sun.resetPathDraw()
		});
		this.dateController = this.gui.add(this.config, 'date')
		this.gui.add(this.config, 'animate').name('Animate Sun').onChange(value=>{
			if(value) {
				this.animateStartDate = this.config.dateObject;
				this.tween.restart()
			}
			else {
				this.sun.resetPathDraw()
				this.tween.pause()
			}
		});
		
		this.dateController.name('Date (IST)').onChange((value)=>{
			this.config.dateObject = stringTodate(value)
			if( !this.config.animate ) {
				this.sun.resetPathDraw()
			}
		}).listen();	
		
		const date = new Date();
		this.config.dateObject = date;
		this.dateController.setValue(dateToString(date));

		this.tween = gsap.to(this.config, { animationTime : 24*60*60, duration: 5, ease: "none", repeat: -1, onUpdate: ()=>{
			const newDate = new Date(this.animateStartDate.getTime());
			newDate.setSeconds(newDate.getSeconds() + parseInt(this.config.animationTime))
			this.setDate( newDate );

		} });
		this.tween.pause();

		this.gui.onChange( () => onChange() )
	}

	setDate(date) {
		this.config.dateObject = date;
		this.dateController.setValue(dateToString(date))
	}
}

export default ControlPanel