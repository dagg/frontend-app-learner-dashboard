import React, { useState, useEffect } from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import { reduxHooks } from 'hooks';
import {
  CourseFilterControls,
} from 'containers/CourseFilterControls';
import CourseListSlot from 'plugin-slots/CourseListSlot';
import NoCoursesViewSlot from 'plugin-slots/NoCoursesViewSlot';

import { useCourseListData } from './hooks';

import messages from './messages';

import './index.scss';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

const NewsletterBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const user = getAuthenticatedUser();
    if (!user) { return; }

    const { userId, email } = user;
    // const url = `http://127.0.0.1:5003/el/newsletter/newsletter_choice/${userId}/${email}/`;
    const url = `http://192.168.1.12:5003/el/newsletter/newsletter_choice/9/${email}/`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.ERROR || data.active === 0) {
          setShowBanner(true);
        }
      })
      .catch((err) => {
        console.error('Newsletter fetch error:', err);
      });
  }, []);

  if (!showBanner) { return null; }

  const user = getAuthenticatedUser();
  const { userId, email } = user || {};

  return (
    <div id="newsletter_banner_id">
      <div className="dashboard-banner">
        <div className="wrapper-msg urgency-low">
          <div className="msg">
            <div className="msg-content">
              <h2 className="title" />
              <div className="copy">
                <p className="activation-message">
                  Όπως προβλέπεται στους ανανεωμένους{' '}
                  <a href="http://local.openedx.io:8000/honor">Όρους Χρήσης</a>
                  {' '}και στην{' '}
                  <a href="http://local.openedx.io:8000/gdpr">
                    Πολιτική Προστασίας Δεδομένων Προσωπικού Χαρακτήρα
                  </a>
                  , η εγγραφή σας περιλαμβάνει τη συγκατάθεσή σας να λαμβάνετε
                  ηλεκτρονικά μηνύματα ενημέρωσης.
                  <br /><br />
                  Για να λαμβάνετε το ενημερωτικό δελτίο, απαιτείται χωριστή
                  συγκατάθεσή σας την οποία -αν δεν την έχετε ήδη δώσει-
                  μπορείτε να την δώσετε πατώντας το παρακάτω "κουμπί":
                  <br /><br />
                  <center>
                    {/* <a href={`http://127.0.0.1:5003/el/newsletter/newsletter_registration/${userId}/${email}/`} style={{ boxSizing: 'border-box', letterSpacing: 0, border: '1px solid #0d4e6c', borderRadius: '3px', padding: '8px 20px', textAlign: 'center', backgroundColor: 'white' }}>Ναι, θέλω να ενημερώνομαι.</a> */}
                    <a href={`http://192.168.1.12:5003/el/newsletter/newsletter_registration/9/${email}/`} style={{ boxSizing: 'border-box', letterSpacing: 0, border: '1px solid #0d4e6c', borderRadius: '3px', padding: '8px 20px', textAlign: 'center', backgroundColor: 'white' }}>Ναι, θέλω να ενημερώνομαι.</a>
                  </center>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
);
};


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


/**
 * Renders the list of CourseCards, as well as the controls (CourseFilterControls) for modifying the list.
 * Also houses the NoCoursesView to display if the user hasn't enrolled in any courses.
 * @returns List of courses as CourseCards or empty state
*/
export const CoursesPanel = () => {
  const { formatMessage } = useIntl();
  const hasCourses = reduxHooks.useHasCourses();
  const courseListData = useCourseListData();



  // Starting with unpaid courses list //


const { authenticatedUser } = React.useContext(AppContext);

  console.log(">>>"+JSON.stringify({ authenticatedUser })+"<<<");

  const uuid = { authenticatedUser }.userId;

  const [data, setData] = useState([]);

  const mystyles = {
    courselist: {
      clear: "both",
      backgroundColor: "aliceblue",
      listStyleType: "none",
      listStylePosition: "inside",
      border: "1px grey solid",
      borderRadius: "5px",
      padding: "15px",
      margin: "10px 10px 10px -40px"
    },

    courseimg: {
      padding: "1px",
      borderRadius: "5px",
      border: "1px light-grey solid"
    },

    ctitle: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden"
    },

    ctexttitle: {
      color: "#646464",
      font: "normal 1.2em/1.2em Georgia,Cambria,'Times New Roman',Times,serif",
      // paddingRight:"10px",
      fontSize: "18px",
      lineHeight: "26.64px",
      width: "100%",
      clear: "both"
    },
    ctextmessage: {
      color: "#646464",
      font: "normal 1.2em/1.2em Georgia,Cambria,'Times New Roman',Times,serif",
      // paddingRight:"10px",
      fontSize: "18px",
      lineHeight: "26.64px",
      width: "100%",
      clear: "both",
      margin: "10px 10px 10px -40px"
    },
    mybtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontCeight: "400",
      color: "#f2f2f2",
      textAlign: "center",
      verticalAlign: "middle",
      webkitUserSelect: "none",
      mozUserSelect: "none",
      userSelect: "none",
      backgroundColor: "#0A3055",
      border: "1px solid transparent",
      padding: "0.5625rem .5rem",
      fontSize: "1rem",
      lineHeight: "1.3",
      borderRadius: "0.375rem",
      '&:hover': { background: 'grey' }
    }

  }

  useEffect(() => {
    fetch(`https://restapi.palmdev.mathesis.org/fetch-data?uid=${ authenticatedUser.userId }`, {method: 'GET'},
          {headers: { 'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*'}})
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error("Error fetching data:", error));
  }, []);

  const api_data_results = [];
  if (Object.keys(data).length == 0){
    // console.log("NO DATA YET...")
  } else {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    console.log(api_data_results);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    for (let i = 0; i < data.count; i++) {
      api_data_results.push(data.results[i]);
    }
  }

// Ending with unpaid courses list //




  return (
    
    <div className="course-list-container">

      <div>
        <NewsletterBanner />
      </div>

{/* Starting with unpaid courses list */}

  {!data || Object.keys(data).length <= 0 ?
        <p>Loading...</p> :
      <div style={{width: "100%", clear: "both"}}>
         {api_data_results.length>0 ? (
        <div style={mystyles.ctexttitle}>
            <header className="wrapper-header-courses">
                <span className="header-courses">Μαθήματα με ηθική δέσμευση που εκκρεμεί η έκδοση βεβαίωσης:</span>
            </header>
        </div>
        ):(
          <div></div>
        )}
        <ul>
          {api_data_results.map(items =>
          <li key="{items.id}" style={mystyles.courselist}>
            {   
            <div style={mystyles.ctitle}>
              <a href={items.course_url} target='_blank' rel='noopener noreferrer'>
                <img style={mystyles.courseimg} src={items.image_url} width="100px" /> {items.name} </a>

                <div style={{float: 'right', position: 'relative'}} >
                    <form action="http://139.91.205.38:5005/el/cart/" method="POST">
                        <input type="hidden" name="uname" value={ authenticatedUser.username } />
                        <input type="hidden" name="email" value={ authenticatedUser.email } />
                        <input type="hidden" name="uid" value={ authenticatedUser.userId } />
                        <input type="hidden" name="cid" value={items.id} />
                        <input type="hidden" name="payhash" value={ data.payhash } />
                        <input type="hidden" name="token" value={ data.token } />
                        <input type="submit" value="Έκδοση Βεβαίωσης" className="mybtn" style={mystyles.mybtn} />
                    </form>
                </div>
            </div>
            }
            </li>
          )
            }
            {api_data_results.length>0 ? (
            <div className="header-courses" style={mystyles.ctextmessage}> Σας ενημερώνουμε ότι όσοι δεν έχουν εκπληρώσει την ηθική δέσμευση που έχουν αναλάβει σε περισσότερα από 2 μαθήματα
              των οποίων οι προθεσμίες πληρωμής έχουν λήξει, στα νέα μαθήματα που τυχόν παρακολουθήσουν δεν θα έχουν πρόσβαση στην τελική τους εξέταση,
              υπό τον όρο βέβαια ότι η μη τήρηση της δέσμευσής τους συνεχίζεται. </div>
        ):(
          <div></div>
        )}
        < hr />
          </ul>
      </div>
      }


{/* Ending with unpaid courses list */}

      <div className="course-list-heading-container">
        <h2 className="course-list-title">{formatMessage(messages.myCourses)}</h2>
        <div className="course-filter-controls-container">
          <CourseFilterControls {...courseListData.filterOptions} />
        </div>
      </div>
      {hasCourses ? <CourseListSlot courseListData={courseListData} /> : <NoCoursesViewSlot />}
    </div>
  );
};

CoursesPanel.propTypes = {};

export default CoursesPanel;
