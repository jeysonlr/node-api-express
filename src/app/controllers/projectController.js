const express = require('express')
const Project = require('../models/project')
const Task = require('../models/task')
const authMiddleware = require('../middlewares/validationToken/auth')

const router = express.Router()

router.use(authMiddleware)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks'])

        return res.send({ projects })

    } catch (err) {
        return res.status(400).send({ error: 'Não foi posivel buscar todos os projetos! ' + err })
    }
})

router.get('/:projectId', async (req, res) => {
    try {
        if (!await Project.findById(req.params.projectId))
            return res.status(400).send({ error: 'Registro não encontrado!' })

        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks'])

        return res.send({ project })
    } catch (err) {
        return res.status(400).send({ error: 'Não foi posivel buscar o projeto! ' + err })
    }
})

router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body

        const project = await Project.create({ title, description, user: req.userId })

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id })

            await projectTask.save()
            project.tasks.push(projectTask)

        }))
        await project.save()

        return res.send({ project })
    } catch (err) {
        return res.status(400).send({ error: 'Não foi posivel criar projeto! ' + err })
    }
})

router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body

        const project = await Project.findByIdAndUpdate(req.params.projectId, {
            title,
            description,
        }, { new: true })

        project.tasks = []

        await Task.remove({ project: project._id })

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id })

            await projectTask.save()
            project.tasks.push(projectTask)

        }))
        await project.save()

        return res.send({ project })
    } catch (err) {
        return res.status(400).send({ error: 'Não foi posivel atualizar o projeto! ' + err })
    }
})

router.delete('/:projectId', async (req, res) => {
    try {
        if (!await Project.findById(req.params.projectId))
            return res.status(400).send({ error: 'Este projeto ja foi deletado!' })
            
        await Project.findByIdAndRemove(req.params.projectId)

        return res.send({ data: 'Projeto removido com sucesso!' })
    } catch (err) {
        return res.status(400).send({ error: 'Não foi posivel deletar o projeto! ' + err })
    }
})

module.exports = app => app.use('/projects', router)