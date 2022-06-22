let dataset = [
    {
        "id": 410,
        "type": "group",
        "title": "Group 410",
        "x": 164,
        "y": 140,
        "w": 750,
        "h": 396,
        "pid": null,
        "children": [
            {
                "id": 158,
                "type": "group",
                "title": "Group 158",
                "x": 164,
                "y": 165,
                "w": 750,
                "h": 220,
                "pid": 410,
                "children": [
                    {
                        "id": 265,
                        "type": "task",
                        "title": "Task 265",
                        "content": "Content 1",
                        "x": 714,
                        "y": 190,
                        "w": 200,
                        "h": 100,
                        "pid": 158,
                        "minimized": false
                    },
                    {
                        "id": 514,
                        "type": "group",
                        "title": "Group 514",
                        "x": 164,
                        "y": 215,
                        "w": 500,
                        "h": 160,
                        "pid": 158,
                        "children": [
                            {
                                "id": 55,
                                "type": "task",
                                "title": "Task 55",
                                "content": "Content 4",
                                "x": 464,
                                "y": 265,
                                "w": 200,
                                "h": 100,
                                "pid": 514,
                                "hidden": false,
                                "minimizedBy": false,
                                "minimized": false
                            },
                            {
                                "id": 46,
                                "type": "task",
                                "title": "Task 46",
                                "content": "Content 5",
                                "startDay": "2022-4-26",
                                "endDay": "2021-4-10",
                                "pid": 514,
                                "minimized": false,
                                "x": 164,
                                "y": 240,
                                "w": 150,
                                "h": 100,
                                "hidden": false,
                                "minimizedBy": false
                            }
                        ],
                        "minimized": false
                    }
                ]
            },
            {
                "id": 187,
                "type": "task",
                "title": "Task 187",
                "content": "Content 2",
                "x": 264,
                "y": 426,
                "w": 200,
                "h": 100,
                "pid": 410
            },
            {
                "id": 85,
                "type": "task",
                "title": "Task 85",
                "content": "Content 3",
                "minimized": false,
                "x": 614,
                "y": 426,
                "w": 200,
                "h": 100,
                "pid": 410
            }
        ]
    },
    {
        "id": 422,
        "type": "group",
        "title": "Group 422",
        "x": 964,
        "y": 130,
        "w": 350,
        "h": 462,
        "pid": null,
        "children": [
            {
                "id": 510,
                "type": "group",
                "title": "Group 510",
                "x": 964,
                "y": 155,
                "w": 350,
                "h": 281,
                "pid": 422,
                "children": [
                    {
                        "id": 472,
                        "type": "task",
                        "title": "Task 472",
                        "content": "Content 9",
                        "x": 1114,
                        "y": 326,
                        "w": 200,
                        "h": 100,
                        "pid": 510,
                        "hidden": false,
                        "minimizedBy": null,
                        "minimized": false
                    },
                    {
                        "id": 327,
                        "type": "task",
                        "title": "Task 327",
                        "content": "Content 7",
                        "x": 964,
                        "y": 180,
                        "w": 200,
                        "h": 100,
                        "pid": 510,
                        "hidden": false,
                        "minimizedBy": null,
                        "minimized": false
                    }
                ],
                "minimized": false
            },
            {
                "id": 632,
                "type": "task",
                "title": "Task 632",
                "content": "Content 632",
                "pid": 422,
                "x": 1014,
                "y": 482,
                "w": 200,
                "h": 100,
                "minimized": false
            }
        ]
    },
    {
        "id": 492,
        "type": "task",
        "title": "Task 492",
        "content": "Content 492",
        "pid": null,
        "x": 564,
        "y": 636,
        "w": 200,
        "h": 100
    },
    {
        "id": 462,
        "type": "task",
        "title": "Task 462",
        "content": "Content 462",
        "pid": null,
        "x": 264,
        "y": 577,
        "w": 200,
        "h": 100
    }
];

let lines = [
    {
        "id": "con_2",
        "source": "85",
        "target": "492"
    },
    {
        "id": "con_3",
        "source": "492",
        "target": "632"
    },
    {
        "id": "con_4",
        "source": "55",
        "target": "327"
    }
];