const router = require('express').Router();
const auth = require('../middleware/auth');
const Todo = require('../models/todoModel');

router.get('/', auth, async (req, res) => {
	try {
		const todos = await Todo.find({ userId: req.user });

		res.json(todos);
	} catch (err) {
		res.status(500).send({
			err: err.message,
		});
	}
});

router.post('/', auth, async (req, res) => {
	try {
		const { title } = req.body;
		// validation

		if (!title)
			return res.status(400).json({
				msg: 'Not all fields have been entered',
			});

		const newTodo = new Todo({
			title,
			userId: req.user,
		});

		const savedTodo = await newTodo.save();

		res.json(savedTodo);
	} catch (err) {
		res.status(500).send({
			err: err.message,
		});
	}
});

// A user might be authenticated, but we need to make sure they own this todo
router.delete('/:id', auth, async (req, res) => {
	try {
		const todo = await Todo.findOne({
			userId: req.user,
			_id: req.params.id,
		});

		if (!todo)
			return res.status(400).json({
				msg:
					'No todo found with this ID that belongs to the current user',
			});

		const deleted = await Todo.findByIdAndDelete(req.params.id);
		res.json(deleted);
	} catch (err) {
		res.status(500).send({
			err: err.message,
		});
	}
});

router.patch('/:id', auth, async (req, res) => {
	try {
		const { title } = req.body;

		if (!title)
			return res.status(400).json({
				msg: 'Not all fields have been entered',
			});

		const updatedTodo = await Todo.findOneAndUpdate(
			{
				userId: req.user,
				_id: req.params.id,
			},
			{ title }
		);

		if (!updatedTodo)
			return res.status(400).json({
				msg:
					'No todo found with this ID that belongs to the current user',
			});

		updatedTodo.title = title;

		res.json(updatedTodo);
	} catch (err) {
		res.status(500).send({
			err: err.message,
		});
	}
});

module.exports = router;
