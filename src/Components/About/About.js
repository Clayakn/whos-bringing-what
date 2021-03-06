import React from 'react';
import Andrew from '../../styles/assets/andrew-headshot.png';
import Zak from '../../styles/assets/zachary-headshot.png';
import Danielle from '../../styles/assets/danielle-headshot.jpg';
import {Link} from 'react-router-dom';
import Grid from '../Grid/Grid';


function About() {
    return (
      <div className="about_parent">

      <div className="about_developers small">About the Developers:
      <Grid />
        <div className="about_people_container">
          
          <div className="about_person">
           <div className="about_profile_pic"> <img className="about_headshot" src={Danielle} alt="Danielle Headshot" /> </div>
            <div className="about_name"> <h4 className="about_creator_name" >Danielle Lyn</h4></div>
            <div className="about_description"><p className="about_creator_details">Danielle comes from Seattle and loves using React to solve problems.</p></div>
            <div className="about_linkedin"><a href="https://www.linkedin.com/in/danielle-cucinotta-38b79527">Linkedin </a></div>
            <div className="about_github"><a href="https://github.com/DanielleLyn">GitHub </a></div> 
          </div>

          <div className="about_person">
           <div className="about_profile_pic"> <img className="about_headshot" src={Andrew} alt="Andrew Headshot" /></div>
           <div className="about_name"> <h4 className="about_creatorName">Andrew Nam</h4> </div>
           <div className="about_description"><p className="about_creator_details">Andrew is from Dallas and enjoys working with Node.js!</p> </div>
           <div className="about_linkedin"><a href="https://www.linkedin.com/in/andrewknam/">Linkedin </a> </div>
           <div className="about_github"><a href="https://github.com/Clayakn">GitHub </a></div> 
          </div>

          <div className="about_person">
           <div className="about_profile_pic"> <img className="about_headshot" src={Zak} alt="Zachary Headshot" /> </div>
           <div className="about_name"> <h4 className="about_creator_name">Zachary Graham</h4> </div>
           <div className="about_description"> <p className="about_creator_details">Zachary is from Phoenix and takes a keen interest in working with APIs.</p></div>
           <div className="about_linkedin"><a href="https://www.linkedin.com/in/zakgraham/">Linkedin </a></div>
           <div className="about_github"><a href="https://github.com/zakery1">GitHub </a></div> 
          </div>
      
           <div className="about_github_bottom"></div>
          </div>
        </div>


        <div className="about_developers big">
          <div className="about_title">About the Developers:</div>
        <div className="about_people_container">

          <div className="about_person">
           <div className="about_profile_pic"> <img className="about_headshot" src={Danielle} alt="Danielle Headshot" /> </div>
            <div className="about_name"> <h4 className="about_creator_name" >Danielle Lyn</h4></div>
            <div className="about_description"><p className="about_creator_details">Danielle comes from Seattle and loves using React to solve problems.</p></div>
            <div className="about_linkedin"><a href="https://www.linkedin.com/in/danielle-cucinotta-38b79527">Linkedin </a></div>
           <div className="about_github"><a href="https://github.com/DanielleLyn">GitHub </a></div>
          </div>

          <div className="about_person">
           <div className="about_profile_pic"> <img className="about_headshot" src={Andrew} alt="Andrew Headshot" /></div>
           <div className="About_name"> <h4 className="About_creator_name">Andrew Nam</h4> </div>
           <div className="about_description"><p className="about_creator_details">Andrew is from Dallas and enjoys utilizing testing.</p> </div>
           <div className="about_linkedin"><a href="https://www.linkedin.com/in/andrewknam/">Linkedin </a></div>
           <div className="about_github"><a href="https://github.com/Clayakn">GitHub </a></div>
          </div>

          <div className="about_person">
           <div className="about_profile_pic"> <img className="about_headshot" src={Zak} alt="Zachary Headshot" /> </div>
           <div className="about_name"> <h4 className="about_creator_name">Zachary Graham</h4> </div>
           <div className="About_description"> <p className="About_creatorDetails">Zachary is from Phoenix and loves learning new APIs.</p></div>
           <div className="about_linkedin"><a href="https://www.linkedin.com/in/zakgraham/">Linkedin </a></div>
           <div className="about_github"><a href="https://github.com/zakery1">GitHub </a></div>
          
                 
    
          </div>
          <Grid />
        </div>
        </div>
  
      </div>
    );
  }

export default About;
