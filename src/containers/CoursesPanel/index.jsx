import React, { useState, useEffect } from 'react';

import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { useIntl } from '@edx/frontend-platform/i18n';

import { AppContext } from '@edx/frontend-platform/react';

import { reduxHooks } from 'hooks';
import {
  CourseFilterControls,
} from 'containers/CourseFilterControls';
import NoCoursesView from './NoCoursesView';

import CourseList from './CourseList';

import { useCourseListData } from './hooks';

import messages from './messages';

import './index.scss';

import { Link } from 'react-router-dom';

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

  // console.log(">>>"+JSON.stringify({ authenticatedUser })+"<<<");

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

{/* Starting with unpaid courses list */}

{!data || Object.keys(data).length <= 0 ?
      <p>Loading...</p> :
      <div style={{width: "100%", clear: "both"}}>

        <div style={mystyles.ctexttitle}>
            <header className="wrapper-header-courses">
                <span className="header-courses">Μαθήματα με ηθική δέσμευση που εκκρεμεί η έκδοση βεβαίωσης:</span>
            </header>
        </div>

        <ul>
          {api_data_results.map(items =>
          <li key="{items.id}" style={mystyles.courselist}>
            {   
            <div style={mystyles.ctitle}>
              <a href={items.course_url} target='_blank' rel='noopener noreferrer'>
                <img style={mystyles.courseimg} src={items.image_url} width="100px" /> {items.name} </a>


                <div style={{float: 'right', position: 'relative'}} >
                    <form action="https://pay.mathesis.org/el/payments/pay/" method="POST">
                        <input type="hidden" name="uname" value={ authenticatedUser.username } />
                        <input type="hidden" name="email" value={ authenticatedUser.email } />
                        <input type="hidden" name="uid" value={ authenticatedUser.userId } />
                        <input type="hidden" name="cid" value={items.id} />
                        <input type="hidden" name="payhash" value={ data.payhash } />
                        <input type="submit" value="Έκδοση Βεβαίωσης" className="mybtn" style={mystyles.mybtn} />
                    </form>
                </div>
            </div>
            }
            </li>
          )
            }
            <div className="header-courses" style={mystyles.ctextmessage}> Σας ενημερώνουμε ότι όσοι δεν έχουν εκπληρώσει την ηθική δέσμευση που έχουν αναλάβει σε περισσότερα από 2 μαθήματα
              των οποίων οι προθεσμίες πληρωμής έχουν λήξει, στα νέα μαθήματα που τυχόν παρακολουθήσουν δεν θα έχουν πρόσβαση στην τελική τους εξέταση,
              υπό τον όρο βέβαια ότι η μη τήρηση της δέσμευσής τους συνεχίζεται. </div>

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
      {hasCourses ? (
        <PluginSlot
          id="course_list"
        >
          <CourseList {...courseListData} />
        </PluginSlot>
      ) : (
        <PluginSlot
          id="no_courses_view"
        >
          <NoCoursesView />
        </PluginSlot>
      )}
    </div>
  );
};

CoursesPanel.propTypes = {};

export default CoursesPanel;
