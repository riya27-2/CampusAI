import { useState } from "react";
import "./Departments.css";

function Departments() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const departments = [
    {
      icon: "💻",
      name: "Computer Engineering & Information Technology",
      code: "CE",
      description:
        "Study software development, programming, databases, and modern computing technologies.",
      hod: {
        name: "Mr. Ajay Baria",
        phone: "+91 78742 24489",
      },
      faculty: [
        {
          name: "Prof.Kalyani Deshpande",
          phone: "+91 90753 93847",
        },
        {
          name: "Prof.Kinjal Bhagariya",
          phone: "+91 75739 44147",
        },
        {
          name: "Prof.Sumi Saxena",
          phone: "+91 94082 02278",
        },
        {
          name: "Prof.Pooja Bam",
          phone: "+91 73595 64748",
        },
        {
          name: "Prof.Shashwat",
          phone: "+91 74171 98223",
        },
        {
          name: "Prof. Naitul",
          phone: "+91 99130 58748",
        },
        {
          name: "Prof. Dhwani Dave",
          phone: "+91 76782 59740",
        },
        
      ],
    },

    {
      icon: "⚡",
      name: "Electrical Engineering",
      code: "EE",
      description:
        "Learn electrical systems, power generation, electronics, and control technologies.",
      hod: {
        name: "Mr. Amit Prajapati",
        
      },
      faculty: [
        {
          name: "Prof. Baranda Shradhdha",
          
        },
        {
          name: "Prof.Krishabh Mehta",
        
        },
        {
            name:"Prof. Tejas A. Prajapati",
        },
        {
            name:"Prof. Yatin Patel",
        },
      ],
    },

    {
      icon: "⚙️",
      name: "Mechanical Engineering",
      code: "ME",
      description:
        "Explore machines, manufacturing, thermodynamics, and mechanical systems.",
      hod: {
        name: "Mr. Bhavin Pandya",
    
      },
      faculty: [
        {
          name: "Prof. Ankur Vyas",
        },
        {
          name: "Prof. Dharmil H. Lavingiya",
        },
        {
          name: "Prof. Pradip Darji",
        },
        {
            name:"Prof. Sandip Dave",
        },
        {
            name:"Prof. Sagnesh Gaikwad",
        },{
            name:"Prof. Ronak Suthar"
        },{
            name:"Prof. Tejas J. Prajapati"
        }
      ],
    },

    {
      icon: "🏗️",
      name: "Civil Engineering",
      code: "CV",
      description:
        "Study construction, structural design, transportation, and infrastructure.",
      hod: {
        name: "mr. Arpit Gupta",
      },
      faculty: [
        {
          name: "Prof. Himani Bhatt",
        },
        {
          name: "Prof. Saurabh Makwana",
        },{
            name:"Prof. Vinay Prajapati",
        }
      ],
    },

    

    
    
  ];

  /* Department Details */
  if (selectedDepartment) {
    return (
      <div className="departments-page">

        <button
          className="back-button"
          onClick={() => setSelectedDepartment(null)}
        >
          ← Back to Departments
        </button>

        <div className="department-detail-header">
          <div className="department-detail-icon">
            {selectedDepartment.icon}
          </div>

          <div>
            <p className="department-label">DEPARTMENT</p>
            <h1>{selectedDepartment.name}</h1>
            <p>{selectedDepartment.description}</p>
          </div>
        </div>

        {/* HOD */}
        <div className="hod-section">
          <h2>Head of Department</h2>

          <div className="hod-card">
            <div className="person-icon">👨‍🏫</div>

            <div>
              <h3>{selectedDepartment.hod.name}</h3>
              <p>Head of Department</p>

              <a href={`tel:${selectedDepartment.hod.phone}`}>
                📞 {selectedDepartment.hod.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Faculty */}
        <div className="faculty-section">
          <h2>Faculty Members</h2>

          <div className="faculty-grid">
            {selectedDepartment.faculty.map((member, index) => (
              <div className="faculty-card" key={index}>
                <div className="person-icon">👨‍🏫</div>

                <div>
                  <h3>{member.name}</h3>

                  <p>Faculty Member</p>

                  <a href={`tel:${member.phone}`}>
                    📞 {member.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  /* Departments List */
  return (
    <div className="departments-page">

      <p className="department-label">ACADEMICS</p>

      <h1>Departments</h1>

      <p className="department-description">
        Explore departments, programs and academic areas offered by the college.
      </p>

      <div className="departments-grid">
        {departments.map((department) => (
          <div className="department-card" key={department.code}>

            <div className="department-icon">
              {department.icon}
            </div>

            <div className="department-content">

              <span className="department-code">
                {department.code}
              </span>

              <h2>{department.name}</h2>

              <p>{department.description}</p>

              <button
                onClick={() => setSelectedDepartment(department)}
              >
                View Department →
              </button>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Departments;