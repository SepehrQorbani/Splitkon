<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expense>
 */
class ExpenseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence,
            'amount' => $this->faker->randomFloat(2, 10, 1000),
            'description' => $this->faker->paragraph,
            'date' => $this->faker->date(),
            'split' => 1,
        ];
    }
}
