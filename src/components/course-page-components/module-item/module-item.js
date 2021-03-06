import React, {Component} from 'react'
import CoursesApi from "../../api";
import {Disclosure} from "@headlessui/react";
import {AcademicCapIcon, ChevronUpIcon} from "@heroicons/react/solid";
import {BookOpenIcon, PlayIcon} from "@heroicons/react/outline";
import {Link, Route} from "react-router-dom";
import Spinner from "../../main-page-components/spinner";
import LessonPage from "../../lesson-page-components/lesson-page";


export default class ModuleItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            module: null,
            lessons: null
        }
    }

    api = new CoursesApi()

    componentDidMount() {
        this.api.getModule(this.props.id).then(data=>{
            this.setState({module: data})
        })

        this.api.getLessonsByModuleId(this.props.id).then(data=>{
            this.setState({lessons: data})
        })
    }

    render() {
        let {lessons, module} = this.state

        if (!lessons || !module){
            return <Spinner/>
        }

        let {moduleId, moduleTitle, moduleCourseId, moduleNumberOfLessons} = module

        let renderedLessons = lessons.length === 0 ? "No lessons added yet." : lessons.map(elem=>{
            let {lessonId, lessonType, lessonModuleId, lessonTitle, lessonLink, lessonContent} = elem

            let icon
            if (lessonType == "video"){
                icon = <PlayIcon className="w-5 h-5 block mr-3"/>
            }
            if (lessonType == "lecture"){
                icon = <AcademicCapIcon className="w-5 h-5 block mr-3"/>
            }

            return (
                <Link to={'/lesson/'+lessonId} className="hover:text-blue-800 block hover:bg-gray-300 px-4 py-2 rounded">
                    <div className="flex items-center">
                        {icon}
                        {lessonTitle}
                    </div>
                </Link>
            )
        })


        return (
            <div className="mt-2">
                <Disclosure>
                    {({ open }) => (
                        <>
                            <Disclosure.Button className="grid grid-cols-2 gap-4 w-full px-4 py-3 text-lg font-medium text-left text-gray-900 bg-gray-200 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                <div className="flex items-center block">
                                    <ChevronUpIcon
                                        className={`${
                                            open ? "transform rotate-180" : ""
                                        } w-6 h-6 mr-2 text-gray-500 block transition`}
                                    />
                                    <span>{moduleTitle}</span>
                                </div>
                                <div className="flex items-center block">
                                    <BookOpenIcon className="w-5 h-5 block mr-1"/>
                                    {moduleNumberOfLessons}<span className="ml-1">lessons</span>
                                </div>
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-md font-medium text-gray-800 transition border border-2">
                                {renderedLessons}
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
        )
    }
}